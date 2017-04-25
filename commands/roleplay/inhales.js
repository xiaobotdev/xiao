const { Command } = require('discord.js-commando');

module.exports = class InhaleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'inhale',
            group: 'roleplay',
            memberName: 'inhale',
            description: 'Inhales something/someone.',
            args: [{
                key: 'thing',
                prompt: 'What do you want to roleplay with?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        const { thing } = args;
        return message.say(`${message.author} *inhales* ${thing} *but gained no ability...*`);
    }
};
