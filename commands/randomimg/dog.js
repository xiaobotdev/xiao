const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');

module.exports = class DogCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'dog',
            group: 'randomimg',
            memberName: 'dog',
            description: 'Sends a random dog image.'
        });
    }

    async run(msg) {
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('ATTACH_FILES'))
                return msg.say('This Command requires the `Attach Files` Permission.');
        try {
            const { body } = await snekfetch
                .get('https://random.dog/woof.json');
            return msg.channel.send({ files: [body.url] })
                .catch(err => msg.say(err));
        } catch (err) {
            return msg.say(err);
        }
    }
};
