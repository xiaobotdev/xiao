const { Command } = require('discord.js-commando');

module.exports = class HighFivesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'highfive',
            group: 'roleplay',
            memberName: 'highfive',
            description: 'High Fives something/someone.',
            args: [{
                key: 'thing',
                prompt: 'What do you want to roleplay with?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        const { thing } = args;
        return message.say(`${message.author} *high-fives* ${thing}`);
    }
};
