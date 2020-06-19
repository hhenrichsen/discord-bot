// Load environment variables.
import dotenv from 'dotenv';
// Load connection information.
import { Client } from 'discord.js';
import { connect } from 'mongoose';
// Logging
import logger from './services/logger';
import { GuildModel } from './models/Guild';
import TownModel from './models/Town'
import GuildManager from './GuildManager';
import MessageHandler from './MessageHandler';

dotenv.config();

// Setup connection information.
const TOKEN = process.env.BOT_TOKEN;

// Create a new client.
const client = new Client();
const messageHandler = new MessageHandler();

client.on('guildCreate', async (guild) => {
    const guildSettings = await GuildModel.create({ id: guild.id });
    GuildManager.guilds.set(guild.id, guildSettings);
});

client.on('guildDelete', async (guild) => {
    GuildModel.deleteOne({ id: guild.id });
    GuildManager.guilds.delete(guild.id);
    TownModel.updateMany({ server: guild.id }, { active: false });
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
    await connect(`mongodb://${process.env.DB_USER}:${encodeURI(process.env.DB_PASS)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`);
    return client.login(TOKEN);
})().catch(err => {
    logger.error(err);
});