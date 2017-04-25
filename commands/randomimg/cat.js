const { Command } = require('discord.js-commando');
const cats = require('./cats');

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

    run(message) {
        if (message.channel.type !== 'dm')
            if (!message.channel.permissionsFor(this.client.user).hasPermission('ATTACH_FILES'))
                return message.say('This Command requires the `Attach Files` Permission.');
        const cat = cats[Math.floor(Math.random() * cats.length)];
        return message.channel.send({files: [`./images/Cat${cat}`]});
    }
};
