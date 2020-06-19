import { model, Schema, Document } from 'mongoose';

export interface GuildConfig {
}

export interface GuildSettings extends Document {
    id: string;
    prefix: string;
    logChannel?: string;
}

const GuildSchema = new Schema({
    snowflake: String,
    prefix: {
        type: String,
        default: process.env.DEFAULT_PREFIX,
    },
    logChannel: {
        type: String,
    },
}, {
    timestamps: true
});

export const GuildModel = model<GuildSettings>('Guild', GuildSchema);