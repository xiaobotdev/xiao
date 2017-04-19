const { Command } = require('discord.js-commando');
const math = require('mathjs');

module.exports = class MathCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'math',
            aliases: [
                'add',
                'subtract',
                'multiply',
                'divide'
            ],
            group: 'random',
            memberName: 'math',
            description: 'Does Math (;math 2 + 2)',
            examples: [';math 2 + 2'],
            args: [{
                key: 'expression',
                prompt: 'What do you want to answer?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const { expression } = args;
        try {
            const solved = math.eval(expression);
            return message.say(solved).catch(() => message.say(':x: Error! Invalid statement!'));
        } catch (err) {
            return message.say(':x: Error! Invalid statement!');
        }
    }
};
