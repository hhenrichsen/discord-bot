import { TextChannel, DMChannel, NewsChannel, MessageEmbed } from "discord.js";
import Command from "./commands/Command";

export function showErrorEmbed(channel: TextChannel | DMChannel | NewsChannel, command: Command | string, error: string) {
    const embed = new MessageEmbed();
    if(typeof command !== "string" && command.name !== undefined) {
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