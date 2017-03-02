const commando = require('discord.js-commando');

class EatCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'eat', 
            group: 'roleplay',
            memberName: 'eat',
            description: 'Eats something/someone. (;eat @User)',
            examples: [';eat @User']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let username = message.content.split(" ").slice(1).join(" ");
        message.channel.sendMessage(message.author + ' *eats* ' + username);
    }
}

module.exports = EatCommand;