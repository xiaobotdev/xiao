const { Command } = require('discord.js-commando');
const request = require('superagent');

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
        try {
            const { body } = await request
                .get('https://random.dog/woof.json');
            return msg.channel.send({ files: [body.url] })
                .catch(err => msg.say(err));
        } catch (err) {
            return msg.say(err);
        }
    }
};
