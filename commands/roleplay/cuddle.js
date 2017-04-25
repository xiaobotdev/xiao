const { Command } = require('discord.js-commando');

module.exports = class CuddleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'cuddle',
            group: 'roleplay',
            memberName: 'cuddle',
            description: 'Cuddles something/someone.',
            args: [{
                key: 'thing',
                prompt: 'What do you want to roleplay with?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        const { thing } = args;
        return message.say(`${message.author} *cuddles* ${thing}`);
    }
};
