const { Command } = require('discord.js-commando');

module.exports = class PokeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'poke',
            group: 'roleplay',
            memberName: 'poke',
            description: 'Pokes something/someone.',
            args: [{
                key: 'thing',
                prompt: 'What do you want to roleplay with?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        const { thing } = args;
        return message.say(`${message.author} *pokes* ${thing}`);
    }
};
