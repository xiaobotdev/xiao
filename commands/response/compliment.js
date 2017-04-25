const { Command } = require('discord.js-commando');
const compliments = require('./compliments');

module.exports = class ComplimentCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'compliment',
            group: 'response',
            memberName: 'compliment',
            description: 'Compliments something/someone.',
            args: [{
                key: 'thing',
                prompt: 'What do you want to compliment?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        const { thing } = args;
        const compliment = compliments[Math.floor(Math.random() * compliments.length)];
        return message.say(`${thing}, ${compliment}`);
    }
};
