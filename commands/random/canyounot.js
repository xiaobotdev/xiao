const commando = require('discord.js-commando');

class CanYouNot extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'canyounot', 
            group: 'random',
            memberName: 'canyounot',
            description: 'Can YOU not? (;canyounot)',
            examples: [';canyounot']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        message.channel.sendMessage('Can YOU not?');
    }
}

module.exports = CanYouNot;