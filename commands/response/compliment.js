const { Command } = require('discord.js-commando');
const compliments = require('./compliments.json');

module.exports = class ComplimentCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'compliment',
            group: 'response',
            memberName: 'compliment',
            description: 'Compliments the user of your choice. (x;compliment @User)',
            examples: ['x;compliment @User'],
            args: [{
                key: 'thing',
                prompt: 'What do you want to compliment?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const { thing } = args;
        const compliment = compliments[Math.floor(Math.random() * compliments.length)];
        return message.say(`${thing}, ${compliment}`);
    }
};
