const { Command } = require('discord.js-commando');

module.exports = class KissCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'kiss',
            group: 'roleplay',
            memberName: 'kiss',
            description: 'Kisses something/someone.',
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
        return msg.say(`${msg.author} *kisses* ${thing}`);
    }
};
