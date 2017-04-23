const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const request = require('superagent');

module.exports = class TodayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'today',
            aliases: [
                'history'
            ],
            group: 'random',
            memberName: 'today',
            description: 'Tells you what happened today in history.'
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return message.say(':x: Error! I don\'t have the Embed Links Permission!');
        }
        try {
            const { text } = await request
                .get('http://history.muffinlabs.com/date')
                .buffer(true);
            const data = JSON.parse(text);
            const events = data.data.Events;
            const randomNumber = Math.floor(Math.random() * events.length);
            const embed = new RichEmbed()
                .setColor(0x9797FF)
                .setURL(data.url)
                .setTitle(`On this day (${data.date})...`)
                .setTimestamp()
                .setDescription(`${events[randomNumber].text} (${events[randomNumber].year})`);
            return message.embed(embed);
        } catch (err) {
            return message.say(':x: Error! Something went wrong!');
        }
    }
};
