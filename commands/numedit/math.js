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
        let expression = args.expression;
        try {
            let solved = math.eval(expression);
            return message.channel.send(solved).catch(err => message.channel.send(":x: Error! Invalid statement!"));
        }
        catch (err) {
            return message.channel.send(":x: Error! Invalid statement!");
        }
    }
};
