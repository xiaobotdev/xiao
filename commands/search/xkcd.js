const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class XKCDCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'xkcd',
            aliases: ['kcd'],
            group: 'search',
            memberName: 'xkcd',
            description: 'Gets an XKCD Comic, optionally opting for today\'s or random.',
            clientPermissions: ['EMBED_LINKS'],
            args: [
                {
                    key: 'type',
                    prompt: 'Please enter either a specific comic number, today, or random.',
                    type: 'string',
                    default: 'random',
                    parse: (type) => type.toLowerCase()
                }
            ]
        });
    }

    async run(msg, args) {
        const { type } = args;
        const current = await snekfetch
            .get('https://xkcd.com/info.0.json');
        if (type === 'today') {
            const embed = new RichEmbed()
                .setTitle(`${current.body.num} - ${current.body.title}`)
                .setURL(`https://xkcd.com/${current.body.num}`)
                .setImage(current.body.img)
                .setFooter(current.body.alt);
            return msg.embed(embed);
        } else if (type === 'random') {
            const random = Math.floor(Math.random() * current.body.num) + 1;
            const { body } = await snekfetch
                .get(`https://xkcd.com/${random}/info.0.json`);
            const embed = new RichEmbed()
                .setTitle(`${body.num} - ${body.title}`)
                .setURL(`https://xkcd.com/${body.num}`)
                .setImage(body.img)
                .setFooter(body.alt);
            return msg.embed(embed);
        } else {
            const choice = parseInt(type, 10);
            if (isNaN(choice) || current.body.num < choice || choice < 1) return msg.say('Invalid Number.');
            const { body } = await snekfetch
                .get(`https://xkcd.com/${choice}/info.0.json`);
            const embed = new RichEmbed()
                .setTitle(`${body.num} - ${body.title}`)
                .setURL(`https://xkcd.com/${body.num}`)
                .setImage(body.img)
                .setFooter(body.alt);
            return msg.embed(embed);
        }
    }
};
