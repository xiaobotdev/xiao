const { Command } = require('discord.js-commando');

module.exports = class FalconPunchCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'falconpunch',
            group: 'roleplay',
            memberName: 'falconpunch',
            description: 'Falcon Punches something/someone.',
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
        return msg.say(`${msg.author} *falcon punches* ${thing}`);
    }
};
