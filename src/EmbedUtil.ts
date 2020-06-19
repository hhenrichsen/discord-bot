import { TextChannel, MessageEmbed } from "discord.js";
import Command from "./commands/Command";

export function showErrorEmbed(channel: TextChannel, command: Command, error: string) {
    const embed = new MessageEmbed();
    if(command.name !== undefined) {
        embed.setTitle(`${process.env.BOT_NAME} | ${command.name} | Error`);
    }
    else {
        embed.setTitle(`${process.env.BOT_NAME} | Error`);
    }
    embed.setColor('#FFAA00');
    embed.setDescription(error);
    // embed.addField('Timestamp', new Date().toISOString());
    channel.send(embed);
}

export function buildBaseEmbed(command: Command) : MessageEmbed {
    const embed = new MessageEmbed();
    embed.setTitle(`${process.env.BOT_NAME} | ${command.name}`)
    return embed;
}