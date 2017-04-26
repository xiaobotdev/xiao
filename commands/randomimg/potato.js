const { Command } = require('discord.js-commando');
const potatoes = require('./potatoes');

module.exports = class PotatoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'potato',
            aliases: [
                'tater'
            ],
            group: 'randomimg',
            memberName: 'potato',
            description: 'Sends a random potato image.'
        });
    }

    run(message) {
        if (message.channel.type !== 'dm')
            if (!message.channel.permissionsFor(this.client.user).has('ATTACH_FILES'))
                return message.say('This Command requires the `Attach Files` Permission.');
        const potato = potatoes[Math.floor(Math.random() * potatoes.length)];
        return message.channel.send({files: [`./images/Potato${potato}`]});
    }
};
