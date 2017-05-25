const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class XKCDCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'xkcd',
            aliases: ['kcd'],
            group: 'randomimg',
            memberName: 'xkcd',
            description: 'Gets an XKCD Comic, optionally opting for today\'s.',
            args: [
                {
                    key: 'type',
                    prompt: 'Would you like to get the comic for today or random?',
                    type: 'string',
                    validate: type => {
                        if (['today', 'random'].includes(type.toLowerCase())) return true;
                        return 'Please enter either `today` or `random`';
                    },
                    default: 'random'
                }
            ]
        });
    }

    async run(msg, args) {
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('ATTACH_FILES'))
                return msg.say('This Command requires the `Attach Files` Permission.');
        const { type } = args;
        try {
            const current = await snekfetch
                .get('https://xkcd.com/info.0.json');
            if (type === 'today') {
                const embed = new RichEmbed()
                    .setTitle(`${current.body.num} - ${current.body.title}`)
                    .setURL(`https://xkcd.com/${current.body.num}`)
                    .setImage(current.body.img)
                    .setFooter(current.body.alt);
                return msg.embed(embed);
            } else {
                const random = Math.floor(Math.random() * current.body.num) + 1;
                const { body } = await snekfetch
                    .get(`https://xkcd.com/${random}/info.0.json`);
                const embed = new RichEmbed()
                    .setTitle(`${body.num} - ${body.title}`)
                    .setURL(`https://xkcd.com/${body.num}`)
                    .setImage(body.img)
                    .setFooter(body.alt);
                return msg.embed(embed);
            }
        } catch (err) {
            return msg.say(`${err.name}: ${err.message}`);
        }
    }
};
