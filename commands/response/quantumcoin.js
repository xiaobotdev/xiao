const commando = require('discord.js-commando');

module.exports = class QuantumCoinCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'quantumcoin',
            aliases: [
                'oddcoin',
                'brokencoin',
                'qcoin'
            ],
            group: 'response',
            memberName: 'quantumcoin',
            description: 'Flips a coin that lands on nothing. (;quantumcoin)',
            examples: [';quantumcoin']
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        let qcoin = ['on nothing', 'on NaN', 'on 0', 'in the air', 'on null'];
        qcoin = qcoin[Math.floor(Math.random() * qcoin.length)];
        return message.say(`It landed ${qcoin}.`);
    }
};
