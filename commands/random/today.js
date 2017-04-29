const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const request = require('superagent');

module.exports = class TodayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'today',
            group: 'random',
            memberName: 'today',
            description: 'Tells you what happened today in history.'
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm')
            if (!message.channel.permissionsFor(this.client.user).has('EMBED_LINKS'))
                return message.say('This Command requires the `Embed Links` Permission.');
        try {
            const { text } = await request
                .get('http://history.muffinlabs.com/date')
                .buffer(true);
            const parsed = JSON.parse(text);
            const events = parsed.data.Events;
            const random = Math.floor(Math.random() * events.length);
            const embed = new RichEmbed()
                .setColor(0x9797FF)
                .setURL(parsed.url)
                .setTitle(`On this day (${parsed.date})...`)
                .setTimestamp()
                .setDescription(`${events[random].year}: ${events[random].text}`);
            return message.embed(embed);
        } catch (err) {
            return message.say('An Unknown Error Occurred.');
        }
    }
};
