const { Command } = require('discord.js-commando');
const roasts = require('./roasts.json');

module.exports = class RoastCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'roast',
            aliases: [
                'burn'
            ],
            group: 'response',
            memberName: 'roast',
            description: 'Roasts the user of your choice. (x;roast @User)',
            examples: ['x;roast @username'],
            args: [{
                key: 'thing',
                prompt: 'What do you want to roast?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const { thing } = args;
        const roast = roasts[Math.floor(Math.random() * roasts.length)];
        return message.say(`${thing}, ${roast}`);
    }
};
