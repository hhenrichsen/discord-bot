import {Collection, Message, MessageEmbed} from "discord.js";
import Command from './commands/Command';
import fs from "fs";
import logger from "./services/logger";
import  { GuildSettings, GuildModel } from "./models/Guild";
import GuildManager from "./GuildManager";
import {showErrorEmbed} from "./EmbedUtil";
import  { User, UserModel } from "./models/User";


interface MessageData {
    content: string,
    parts: string[],
    cmd: string,
    args: string[],
    guildSettings?: GuildSettings
}

export default class MessageHandler {
    private commands: Collection<string, Command>;
    constructor() {
        this.commands = new Collection<string, Command>();
        logger.info('Loading Commands:');
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.cmd.js'));

        for(const file of commandFiles) {
            const command = new Command(require(`./commands/${file}`));

            logger.info(` - "${command.name}" loaded!`);
            if(command.aliases) {
                for(const alias of command.aliases) {
                    this.commands.set(alias, command);
                }
            }
            this.commands.set(command.name.toLowerCase(), command);
        }
    }

    async handleGeneralMessage(msg : Message, guildSettings? : GuildSettings) : Promise<MessageData> {
        const content = msg.content.substr(guildSettings ? guildSettings.prefix.length : 1);
        const parts = content.split(/\s+/);
        const cmd = parts[0];
        const args = parts.slice(1);

        return {
            content, parts, cmd, args, guildSettings,
        };
    };

    async handleMessage(msg : Message) {
        if(msg.author.bot) {
            return;
        }
        let guildSettings;
        if(GuildManager.guilds.has(msg.guild.id)) {
            guildSettings = GuildManager.guilds.get(msg.guild.id);
        }
        else {
            guildSettings = await GuildModel.findOne({ id: msg.guild.id });
            if(guildSettings === undefined || guildSettings === null) {
                guildSettings = await GuildModel.create({ id: msg.guild.id });
                logger.warn(`Found message in unknown guild ${msg.guild.name} (${msg.guild.id}). Creating guild data.`);
            }
            GuildManager.guilds.set(msg.guild.id, guildSettings);
        }
        if(!msg.content.startsWith(guildSettings.prefix) && msg.content.match(/^<@!?(\d+)/)) {
            return;
        }
        const messageData = await this.handleGeneralMessage(msg, guildSettings);
        await this.handleCommand(msg, messageData);
    };

    async handleDM(msg: Message) {
        if(msg.author.bot) {
            return;
        }
        const messageData = await this.handleGeneralMessage(msg);
        await this.handleCommand(msg, messageData);
    };

    async handleCommand(msg : Message, messageData? : MessageData) {
        const { cmd, args, guildSettings } = messageData;
        if(!this.commands.has(cmd)) {
            if(guildSettings && !guildSettings.config.showInvalidCommand) {
                return;
            }
            logger.silly(`Invalid command ${cmd}.`);
            showErrorEmbed(msg.channel, cmd, `Invalid command \`${cmd}\`.`);
            return;
        }
        const command = this.commands.get(cmd.toLowerCase());
        if(!command.contexts.has(msg.channel.type)) {
            logger.silly(`Invalid context for command ${cmd} for ${msg.author.id}`);
            if(guildSettings && !guildSettings.config.showInvalidCommand) {
                return;
            }
            showErrorEmbed(msg.channel, command, 'You can\'t use that here.');
            return;
        }
        // @ts-ignore
        if(command.requiredPermissions && !msg.member.hasPermission(command.requiredPermissions)) {
            logger.silly(`No permissions to use command ${cmd} for ${msg.author.id}`);
            if(guildSettings && !guildSettings.config.showInvalidCommand) {
                return;
            }
            showErrorEmbed(msg.channel, command, 'You don\'t have permission to use that here.');
            return;
        }
        let user = await UserModel.findOne({ id: msg.author.id });
        if(!user) {
            user = await UserModel.create({ id: msg.author.id });
        }
        try {
            await command.execute(msg, args, guildSettings, user);
        }
        catch (error) {
            logger.error(error);
            const errorEmbed = new MessageEmbed();
            errorEmbed.setTitle(`${process.env.BOT_NAME} | ${command.name} | ERROR`);
            errorEmbed.setColor('#FF0000');
            errorEmbed.setDescription(error);
            errorEmbed.setFooter('Please report this to the author.');
            errorEmbed.addField('Timestamp', new Date().toISOString());
            await msg.channel.send(errorEmbed);
        }
    };
}