const { Command } = require('discord.js-commando');
const puns = require('./puns');

module.exports = class RandomPunCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pun',
            group: 'randomimg',
            memberName: 'pun',
            description: 'Sends a random pun image.'
        });
    }

    run(message) {
        if (message.channel.type !== 'dm')
            if (!message.channel.permissionsFor(this.client.user).has('ATTACH_FILES'))
                return message.say('This Command requires the `Attach Files` Permission.');
        const pun = puns[Math.floor(Math.random() * puns.length)];
        return message.channel.send({files: [`./images/Pun${pun}`]});
    }
};
