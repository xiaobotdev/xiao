const { Command } = require('discord.js-commando');
const eastereggs = require('./eastereggs.json');

module.exports = class EasterEggCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'easteregg',
            aliases: [
                'tag',
                'easter-egg'
            ],
            group: 'random',
            memberName: 'easteregg',
            description: 'Can you discover all the easter eggs?',
            args: [{
                key: 'tag',
                prompt: 'What easter egg do you want to view?',
                type: 'string',
                validate: tag => {
                    if (eastereggs[tag.toLowerCase()]) {
                        return true;
                    }
                    return 'Nope, that\'s not a valid easter egg. Try again!';
                },
                parse: text => text.toLowerCase()
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const { tag } = args;
        return message.say(eastereggs[tag]);
    }
};
