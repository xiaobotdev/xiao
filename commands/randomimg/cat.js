const Command = require('../../structures/Command');
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
        const { body } = await snekfetch
            .get('http://random.cat/meow');
        return msg.say(body.file);
    }
};
