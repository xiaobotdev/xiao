const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const moment = require('moment');

module.exports = class StarCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'star',
            group: 'random',
            memberName: 'star',
            description: 'Stars a message.',
            args: [
                {
                    key: 'id',
                    prompt: 'What is the ID of the message you wish to star?',
                    type: 'string'
                }
            ]
        });
    }

    async run(msg, args, reaction) {
        const { id } = args;
        const channel = msg.guild.channels.get(msg.guild.settings.get('starboard'));
        if (!channel || !channel.permissionsFor(this.client.user).has('EMBED_LINKS')) return null;
        try {
            const message = await msg.channel.fetchMessage(id);
            if (!reaction && msg.author.id === message.author.id)
                return msg.reply('You cannot star your own messages, idiot.');
            const embed = new RichEmbed()
                .setColor(0xFFFF00)
                .setAuthor(message.author.tag, message.author.displayAvatarURL)
                .setDescription(message.content)
                .setImage(message.attachments.first() ? message.attachments.first().url : null)
                .setFooter(moment(message.createdTimestamp).format('MMMM Do YYYY h:mm:ss A'));
            await channel.send({ embed });
            return null;
        } catch (err) {
            return msg.say(`${err.name}: ${err.message}`);
        }
    }
};
