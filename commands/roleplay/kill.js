const { Command } = require('discord.js-commando');

module.exports = class KillCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'kill',
            group: 'roleplay',
            memberName: 'kill',
            description: 'Kills something/someone.',
            args: [{
                key: 'thing',
                prompt: 'What do you want to roleplay with?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        const { thing } = args;
        return message.say(`${message.author} *kills* ${thing}`);
    }
};
