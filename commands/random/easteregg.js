const { Command } = require('discord.js-commando');
const eastereggs = require('./eastereggs');

module.exports = class EasterEggCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'easteregg',
            aliases: [
                'tag'
            ],
            group: 'random',
            memberName: 'easteregg',
            description: 'Can you discover all the easter eggs?',
            args: [
                {
                    key: 'tag',
                    prompt: 'What easter egg do you want to view?',
                    type: 'string',
                    validate: tag => {
                        if(eastereggs[tag.toLowerCase()]) return true;
                        return 'Nope, that\'s not a valid easter egg. Try again!';
                    },
                    parse: tag => tag.toLowerCase()
                }
            ]
        });
    }

    run(msg, args) {
        const { tag } = args;
        return msg.say(eastereggs[tag]);
    }
};
