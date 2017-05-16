const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');

module.exports = class CatCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'cat',
            aliases: ['neko'],
            group: 'randomimg',
            memberName: 'cat',
            description: 'Sends a random cat image.'
        });
    }

    async run(msg) {
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('ATTACH_FILES'))
                return msg.say('This Command requires the `Attach Files` Permission.');
        try {
            const { body } = await snekfetch
                .get('http://random.cat/meow');
            return msg.say({ files: [body.file] })
                .catch(() => msg.say('An Error Occurred while sending the image.'));
        } catch (err) {
            return msg.say(err.message);
        }
    }
};
