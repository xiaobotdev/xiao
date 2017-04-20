const { Command } = require('discord.js-commando');
const answers = require('./8ballanswers.json');

module.exports = class MagicBallCommand extends Command {
    constructor(client) {
        super(client, {
            name: '8ball',
            group: 'response',
            memberName: '8ball',
            description: 'Predicts your future. (x;8ball Am I stupid?)',
            examples: ['x;8ball Am I stupid?'],
            args: [{
                key: 'question',
                prompt: 'What do you want to ask the 8 ball?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const { question } = args;
        const answer = answers[Math.floor(Math.random() * answers.length)];
        return message.say(`Question: ${question}\n:8ball: ${answer} :8ball:`);
    }
};
