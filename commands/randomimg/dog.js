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
        try {
            const { body } = await snekfetch
                .get('https://random.dog/woof.json');
            return msg.say(body.url);
        } catch (err) {
            return msg.say(`${err.name}: ${err.message}`);
        }
    }
};
