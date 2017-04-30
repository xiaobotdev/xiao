const { Command } = require('discord.js-commando');

module.exports = class PunchCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'punch',
            group: 'roleplay',
            memberName: 'punch',
            description: 'Punches something/someone.',
            args: [{
                key: 'thing',
                prompt: 'What do you want to roleplay with?',
                type: 'string'
            }]
        });
    }

    run(msg, args) {
        const { thing } = args;
        return msg.say(`${msg.author} *punches* ${thing}`);
    }
};
