const commando = require('discord.js-commando');

class HugCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'hug', 
            group: 'roleplay',
            memberName: 'hug',
            description: 'Hugs someone. (;hug @User)',
            examples: [';hug @User']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let username = message.content.split(" ").slice(1).join(" ");
        message.channel.sendMessage(message.author + ' *hugs* ' + username);
    }
}

module.exports = HugCommand;