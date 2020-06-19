import { model, Schema, Document } from 'mongoose';
import { Client } from 'discord.js';

export interface GuildSettings extends Document {
    snowflake: string;
    prefix?: string;
    logChannel?: string;
}

const GuildSchema = new Schema({
    snowflake: String,
    prefix: {
        type: String,
        required: false,
        default: process.env.DEFAULT_PREFIX,
    },
    logChannel: {
        required: false,
        type: String,
    },
}, {
    timestamps: true
});

GuildSchema.methods.sendLogMessage = function(message: String, client: Client) {
    if(this.logChannel === undefined) {
        return;
    }
    client.shard.broadcastEval(`
        const channel = this.channels.cache.get('${this.logChannel}');
        if(channel) {
            channel.send('${message}');
        }
    `);
}

export const GuildModel = model<GuildSettings>('Guild', GuildSchema);