const { Command } = require('discord.js-commando');
const request = require('superagent');

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
            const { body } = await request
                .get('http://random.cat/meow');
            return msg.channel.send({ files: [body.file] })
                .catch(err => msg.say(err));
        } catch (err) {
            return msg.say(err);
        }
    }
};
