const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');

module.exports = class XKCDCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'xkcd',
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
            if (type === 'today') return msg.say({ files: [current.body.img] })
                .catch(() => msg.say('An Error Occurred while sending the image.'));
            else {
                const random = Math.floor(Math.random() * current.body.num) + 1;
                const { body } = await snekfetch
                    .get(`https://xkcd.com/${random}/info.0.json`);
                return msg.say({ files: [body.img] })
                    .catch(() => msg.say('An Error Occurred while sending the image.'));
            }
        } catch (err) {
            return msg.say(err.message);
        }
    }
};
