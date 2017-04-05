const commando = require('discord.js-commando');
const math = require('mathjs');

module.exports = class MathCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'math',
            aliases: [
                'add',
                'subtract',
                'multiply',
                'divide'
            ],
            group: 'numedit',
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
        console.log(`[Command] ${message.content}`);
        const expression = args.expression;
        try {
            const solved = math.eval(expression);
            return message.say(solved).catch(err => message.say(':x: Error! Invalid statement!'));
        }
        catch (err) {
            return message.say(':x: Error! Invalid statement!');
        }
    }
};
