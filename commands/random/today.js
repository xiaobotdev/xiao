const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class TodayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'today',
            group: 'random',
            memberName: 'today',
            description: 'Tells you what happened today in history.',
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async run(msg) {
        const { text } = await snekfetch
            .get('http://history.muffinlabs.com/date');
        const body = JSON.parse(text);
        const events = body.data.Events;
        const event = events[Math.floor(Math.random() * events.length)];
        const embed = new RichEmbed()
            .setColor(0x9797FF)
            .setURL(body.url)
            .setTitle(`On this day (${body.date})...`)
            .setTimestamp()
            .setDescription(`${event.year}: ${event.text}`);
        return msg.embed(embed);
    }
};
