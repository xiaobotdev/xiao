const { Command } = require('discord.js-commando');
const answers = require('./8ballanswers');

module.exports = class MagicBallCommand extends Command {
    constructor(client) {
        super(client, {
            name: '8ball',
            group: 'response',
            memberName: '8ball',
            description: 'Predicts your future.',
            args: [{
                key: 'question',
                prompt: 'What do you want to ask the 8 ball?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        const { question } = args;
        const answer = answers[Math.floor(Math.random() * answers.length)];
        return message.say(`Question: ${question}\n:8ball: ${answer} :8ball:`);
    }
};
