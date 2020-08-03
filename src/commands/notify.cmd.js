const { MessageEmbed } = require('discord.js');
const logger = require('../services/logger');

module.exports = {
    name: 'Notify',
    contexts: {
        text: true,
    },
    requiredPermissions: ['MANAGE_GUILD'],
    async execute(msg, args, guildSettings, user) {
        if(args.length > 0) {
            const joinedArgs = args.join();
            const channel = joinedArgs.match(/^<#(\d+)>$/);
            if(channel) {
                guildSettings.logChannel = channel[1];
            }
            else {
                guildSettings.logChannel = msg.channel.id;
            }
        }
        else {
            guildSettings.logChannel = msg.channel.id;
        }
        const embed = new MessageEmbed();
        embed.setTitle(`${process.env.BOT_NAME} | Notify`);
        embed.setColor('#00ffaa');
        embed.setDescription(`Logging channel set to <#${guildSettings.logChannel}>`);
        await guildSettings.save();
        msg.channel.send(embed);
        logger.info(`User ${msg.author.tag} (${msg.author.id}) set the logging channel of ${msg.guild.name} (${guildSettings.id}) to ${guildSettings.logChannel}.`);
    },
};
