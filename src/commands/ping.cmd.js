const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'Ping',
    contexts: {
        text: true,
        dm: true,
    },
    async execute(msg, args, guildSettings, user) {
        const embed = new MessageEmbed();
        embed.setTitle(`${process.env.BOT_NAME} | Ping`);
        embed.setColor('#00ffaa');
        embed.setDescription('Pong!');
        // embed.addField('Arguments', args.join());
        await msg.channel.send(embed);
    },
};