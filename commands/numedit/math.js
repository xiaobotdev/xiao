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
            examples: [';math 2 + 2']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let expression = message.content.split(" ").slice(1).join(" ");
        try {
            let solved = math.eval(expression);
            try {
                let solvedMes = await message.channel.send(solved);
            }
            catch (err) {
                let invalidErr1 = await message.channel.send(":x: Error! Invalid statement!");
            }
        }
        catch (err) {
            let invalidErr2 = await message.channel.send(":x: Error! Invalid statement!");
        }
    }
};
