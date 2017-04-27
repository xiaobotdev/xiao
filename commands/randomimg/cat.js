const { Command } = require('discord.js-commando');
const request = require('superagent');

module.exports = class CatCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'cat',
            aliases: [
                'neko'
            ],
            group: 'randomimg',
            memberName: 'cat',
            description: 'Sends a random cat image.'
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm')
            if (!message.channel.permissionsFor(this.client.user).has('ATTACH_FILES'))
                return message.say('This Command requires the `Attach Files` Permission.');
        try {
            const { body } = await request
                .get('http://random.cat/meow');
            return message.channel.send({files: [body.file]});
        } catch (err) {
            return message.say('An Unknown Error Occurred.');
        }
    }
};
