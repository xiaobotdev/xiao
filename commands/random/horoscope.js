const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const signs = require('../../assets/json/horoscope');

module.exports = class HoroscopeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'horoscope',
            group: 'random',
            memberName: 'horoscope',
            description: 'Gives the horoscope for today for a particular sign.',
            details: `**Signs:** ${signs.join(', ')}`,
            clientPermissions: ['EMBED_LINKS'],
            args: [
                {
                    key: 'sign',
                    prompt: 'Which sign would you like to get the horoscope for?',
                    type: 'string',
                    validate: (sign) => {
                        if (signs.includes(sign.toLowerCase())) return true;
                        else return 'Invalid sign. Use `help horoscope` for a list of signs.';
                    },
                    parse: (sign) => sign.toLowerCase()
                }
            ]
        });
    }

    async run(msg, args) {
        const { sign } = args;
        const { text } = await snekfetch
            .get(`http://sandipbgt.com/theastrologer/api/horoscope/${sign}/today`);
        const body = JSON.parse(text);
        const embed = new RichEmbed()
            .setColor(0x9797FF)
            .setTitle(`Horoscope for ${body.sunsign}...`)
            .setTimestamp()
            .setDescription(body.horoscope)
            .addField('Mood',
                body.meta.mood, true)
            .addField('Intensity',
                body.meta.intensity, true)
            .addField('Date',
                body.date, true);
        return msg.embed(embed);
    }
};
