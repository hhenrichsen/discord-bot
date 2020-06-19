import {Message} from "discord.js";
import {GuildSettings} from "../models/Guild";
import {IUserModel} from "../models/User";

export interface CommandAssignable {
    name: string;
    requiredPermissions?: string[];
    aliases?: string[];
    contexts?: any;
    execute(msg : Message, args : string[], guildConfig : GuildSettings, user : IUserModel) : void;
}

export default class Command {
    public readonly name: string;
    public readonly requiredPermissions?: string[];
    public readonly aliases?: string[];
    public readonly contexts?: Map<string, boolean>;
    public readonly execute : Function;

    constructor(assignable: CommandAssignable) {
        this.name = assignable.name;
        this.requiredPermissions = assignable.requiredPermissions;
        this.aliases = assignable.aliases;
        this.contexts = new Map();
        for(const key of Object.keys(assignable.contexts)) {
            this.contexts.set(key, assignable.contexts[key]);
        }
        this.execute = assignable.execute;
    }
}