const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class TodayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'today',
            aliases: ['event'],
            group: 'random',
            memberName: 'today',
            description: 'Responds with an event that occurred today in history, or on a specific day.',
            clientPermissions: ['EMBED_LINKS'],
            args: [
                {
                    key: 'month',
                    prompt: 'Which month do you want events for?',
                    type: 'integer',
                    default: '',
                    validate: (month) => {
                        if (month < 13 && month > 0) return true;
                        else return 'Please enter a valid month.';
                    }
                },
                {
                    key: 'day',
                    prompt: 'Which day do you want events for?',
                    type: 'integer',
                    default: '',
                    validate: (day) => {
                        if (day < 32 && day > 0) return true;
                        else return 'Please enter a valid day.';
                    }
                }
            ]
        });
    }

    async run(msg, args) {
        const { month, day } = args;
        try {
            const { text } = await snekfetch
                .get(`http://history.muffinlabs.com/date${month && day ? `/${month}/${day}` : ''}`);
            const body = JSON.parse(text);
            const events = body.data.Events;
            const event = events[Math.floor(Math.random() * events.length)];
            const embed = new MessageEmbed()
                .setColor(0x9797FF)
                .setURL(body.url)
                .setTitle(`On this day (${body.date})...`)
                .setTimestamp()
                .setDescription(`${event.year}: ${event.text}`);
            return msg.embed(embed);
        } catch (err) {
            return msg.say(`An error occurred: \`${err.message}\`. You likely entered an invalid date.`);
        }
    }
};
