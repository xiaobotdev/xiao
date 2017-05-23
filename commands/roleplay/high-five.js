const { Command } = require('discord.js-commando');

module.exports = class HighFivesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'high-five',
            group: 'roleplay',
            memberName: 'high-five',
            description: 'High Fives something/someone.',
            args: [
                {
                    key: 'thing',
                    prompt: 'What do you want to roleplay with?',
                    type: 'string'
                }
            ]
        });
    }

    run(msg, args) {
        const { thing } = args;
        return msg.say(`${msg.author} *high-fives* ${thing}`);
    }
};
