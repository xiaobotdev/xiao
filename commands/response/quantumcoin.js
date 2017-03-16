const commando = require('discord.js-commando');

class QuantumCoin extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'quantumcoin', 
            group: 'response',
            memberName: 'quantumcoin',
            description: 'Flips a coin that lands on nothing. (;quantumcoin)',
            examples: [';quantumcoin']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let qcoin = ['on nothing', 'on NaN', 'on 0', 'in the air', 'on null'];
        qcoin = qcoin[Math.floor(Math.random() * qcoin.length)];
        message.channel.send("It landed " + qcoin);
    }
}

module.exports = QuantumCoin;