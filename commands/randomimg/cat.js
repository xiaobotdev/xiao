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
        try {
            const { body } = await snekfetch
                .get('http://random.cat/meow');
            return msg.say(body.file);
        } catch (err) {
            return msg.say(`${err.name}: ${err.message}`);
        }
    }
};
