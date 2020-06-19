const { stripIndent, commaListsAnd } = require('common-tags');
const { showErrorEmbed } = require('../EmbedUtil');
const { MessageEmbed } = require('discord.js');
const logger = require('../services/logger');

module.exports = {
    name: 'Config',
    contexts: {
        text: true,
    },
    usage: stripIndent`config [option] [setting]`,
    requiredPermissions: ['MANAGE_GUILD'],
    async execute(msg, args, client, guildConfig) {
        if(args.length < 2) {
            showErrorEmbed(msg.channel, this, 'Invalid command format. Use: `config [option] [setting]`. Setting defaults to false if not true.');
            return;
        }
        if(args[0] in guildConfig.config) {
            const val = args.slice(1).join().trim();
            if(typeof guildConfig.config[args[0]] === typeof true) {
                guildConfig.config[args[0]] = val.toLowerCase() === 'true' ? true : false;
            }
            else {
                guildConfig.config[args[0]] = val;
            }
            await guildConfig.save();
            const embed = new MessageEmbed();
            embed.setTitle(`${process.env.BOT_NAME} | Config`);
            embed.setDescription(`Successfully set ${args[0]} to ${args[1]}.`);
            embed.setColor('#00ffaa');
            msg.channel.send(embed);
            logger.info(`User ${msg.author.tag} (${msg.author.id}) set ${args[0]} to '${val}' in ${msg.guild.name} (${msg.guild.id})`);
        }
        else {
            const options = Object.keys(guildConfig.config).filter(it => it !== '$init').map(it => `\`${it}\``);
            showErrorEmbed(msg.channel, this, commaListsAnd`Invalid option. Valid options are ${options}.`);
        }
    },
};