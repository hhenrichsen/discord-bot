const { MessageEmbed } = require('discord.js');
const logger = require('../services/logger');

module.exports = {
    name: 'Prefix',
    contexts: {
        text: true,
    },
    requiredPermissions: ['MANAGE_GUILD'],
    async execute(msg, args, guildSettings, user) {
        if(args.length < 1) {
            const embed = new MessageEmbed();
            embed.setTitle(`${process.env.BOT_NAME} | Prefix`);
            embed.setColor('#00ffaa');
            embed.addField('Prefix', guildSettings.prefix);
            msg.channel.send(embed);
        }
        else {
            guildSettings.prefix = args[0];
            const embed = new MessageEmbed();
            embed.setTitle(`${process.env.BOT_NAME} | Prefix`);
            embed.setColor('#00ffaa');
            embed.setDescription(`Set prefix to \`${args[0]}\``);
            await guildSettings.save();
            msg.channel.send(embed);
            logger.info(`User ${msg.author.tag} (${msg.author.id}) set the prefix of ${msg.guild.name} (${guildSettings.id}) to '${args[0]}'.`);
        }
    },
};