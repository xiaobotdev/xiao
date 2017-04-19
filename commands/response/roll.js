const { Command } = require('discord.js-commando');

module.exports = class RollCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'roll',
            aliases: [
                'randomnumber',
                'dice'
            ],
            group: 'response',
            memberName: 'roll',
            description: 'Rolls a Dice of your choice. (;roll 6)',
            examples: [';roll 6'],
            args: [{
                key: 'value',
                prompt: 'Which number do you want to roll?',
                type: 'integer'
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const { value } = args;
        const roll = Math.floor(Math.random() * value) + 1;
        return message.say(`You rolled a ${roll}.`);
    }
};
