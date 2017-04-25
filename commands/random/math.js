const { Command } = require('discord.js-commando');
const math = require('mathjs');

module.exports = class MathCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'math',
            group: 'random',
            memberName: 'math',
            description: 'Does math.',
            args: [{
                key: 'expression',
                prompt: 'What do you want to answer?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        const { expression } = args;
        try {
            const solved = math.eval(expression);
            return message.say(solved).catch(() => message.say(':x: Error! Invalid statement!'));
        } catch (err) {
            return message.say(':x: Error! Invalid statement!');
        }
    }
};
