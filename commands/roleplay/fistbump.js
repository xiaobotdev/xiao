const { Command } = require('discord.js-commando');

module.exports = class FistBumpCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'fistbump',
            group: 'roleplay',
            memberName: 'fistbump',
            description: 'Fistbumps something/someone.',
            args: [{
                key: 'thing',
                prompt: 'What do you want to roleplay with?',
                type: 'string'
            }]
        });
    }

    run(msg, args) {
        const { thing } = args;
        return msg.say(`${msg.author} *fist-bumps* ${thing} *badalalala*`);
    }
};
