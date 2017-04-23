const { Command } = require('discord.js-commando');
const sides = ['on nothing', 'on NaN', 'on 0', 'in the air', 'on null'];

module.exports = class QuantumCoinCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'quantumcoin',
            aliases: [
                'oddcoin',
                'brokencoin',
                'qcoin'
            ],
            group: 'response',
            memberName: 'quantumcoin',
            description: 'Flips a coin that lands on nothing.'
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const qcoin = sides[Math.floor(Math.random() * sides.length)];
        return message.say(`It landed ${qcoin}.`);
    }
};
