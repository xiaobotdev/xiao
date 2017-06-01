const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
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

        this.starred = [];
    }

    async run(msg, args, reaction) {
        const { id } = args;
        const channel = msg.guild.channels.get(msg.guild.settings.get('starboard'));
        if (!channel || this.starred.includes(id)) return null;
        if (!channel.permissionsFor(this.client.user).has('SEND_MESSAGES')) return null;
        const message = await msg.channel.fetchMessage(id);
        if (!reaction && msg.author.id === message.author.id) {
            return msg.reply('You cannot star your own messages, baka.');
        }
        this.starred.push(id);
        if (!channel.permissionsFor(this.client.user).has('EMBED_LINKS')) {
            return msg.say(stripIndents`
                **Author:** ${message.author.tag}
                **Content:** ${message.content}
                **Date:** ${moment(message.createdTimestamp).format('MMMM Do YYYY h:mm:ss A')}
                ${message.attachments.first() ? `**Image:** ${message.attachments.first().url}` : ''}
            `);
        } else {
            const embed = new RichEmbed()
                .setColor(0xFFFF00)
                .setAuthor(message.author.tag, message.author.displayAvatarURL)
                .setDescription(message.content)
                .setImage(message.attachments.first() ? message.attachments.first().url : null)
                .setFooter(moment(message.createdTimestamp).format('MMMM Do YYYY h:mm:ss A'));
            return channel.send({ embed });
        }
    }
};
