const { Command } = require('discord.js-commando');

module.exports = class SlapCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'slap',
            group: 'roleplay',
            memberName: 'slap',
            description: 'Slaps something/someone.',
            args: [{
                key: 'thing',
                prompt: 'What do you want to roleplay with?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        const { thing } = args;
        return message.say(`${message.author} *slaps* ${thing}`);
    }
};
