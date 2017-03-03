const commando = require('discord.js-commando');

class FishyCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'fishy', 
            group: 'response',
            memberName: 'fishy',
            description: 'Catches a fish. (;fishy)',
            examples: [';fishy']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let coin = [':fish:', ':tropical_fish:', ':blowfish:'][Math.floor(Math.random() * 3)];
        message.reply("You caught a: " + coin);
    }
}

module.exports = FishyCommand;