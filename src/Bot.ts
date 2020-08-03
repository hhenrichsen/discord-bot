// Load environment variables.
import dotenv from 'dotenv';
// Load connection information.
import { Client } from 'discord.js';
import mongoose from 'mongoose';
// Logging
import logger from './services/logger';
import { GuildModel } from './models/Guild';
import GuildManager from './GuildManager';
import MessageHandler from './MessageHandler';

dotenv.config();

// Setup connection information.
const TOKEN = process.env.BOT_TOKEN;

// Create a new client.
const client = new Client();
const messageHandler = new MessageHandler();

client.on('guildCreate', async (guild) => {
    const guildSettings = await GuildModel.create({ snowflake: guild.id });
    GuildManager.guilds.set(guild.id, guildSettings);
});

client.on('guildDelete', async (guild) => {
    GuildModel.deleteOne({ id: guild.id });
    GuildManager.guilds.delete(guild.id);
});

client.on('message', async (msg) => {
    if(msg.channel.type == 'dm') {
        messageHandler.handleDM(msg).catch(err => {
            logger.error(err);
        });
    }
    else if(msg.channel.type == 'text') {
        messageHandler.handleMessage(msg).catch(err => {
            logger.error(err);
        });
    }
});
(async () => {    
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);
    await mongoose.connect(`mongodb://${process.env.DB_USER}:${encodeURI(process.env.DB_PASS)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`);
    return client.login(TOKEN);
})().catch(err => {
    logger.error(err);
});