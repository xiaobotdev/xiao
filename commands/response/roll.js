const { Command } = require('discord.js-commando');

module.exports = class RollCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'roll',
            aliases: [
                'dice'
            ],
            group: 'response',
            memberName: 'roll',
            description: 'Rolls a dice with a maximum value you specify.',
            args: [{
                key: 'value',
                prompt: 'What is the maximum number you wish to appear?',
                type: 'integer'
            }]
        });
    }

    run(message, args) {
        const { value } = args;
        const roll = Math.floor(Math.random() * value) + 1;
        return message.say(`You rolled a ${roll}.`);
    }
};
