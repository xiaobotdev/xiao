const commando = require('discord.js-commando');

module.exports = class QuantumCoin extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'quantumcoin',
            aliases: [
                'oddcoin',
                'brokencoin'
            ],
            group: 'response',
            memberName: 'quantumcoin',
            description: 'Flips a coin that lands on nothing. (;quantumcoin)',
            examples: [';quantumcoin']
        });
    }

    async run(message) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log("[Command] " + message.content);
        let qcoin = ['on nothing', 'on NaN', 'on 0', 'in the air', 'on null'];
        qcoin = qcoin[Math.floor(Math.random() * qcoin.length)];
        message.channel.send("It landed " + qcoin);
    }
};