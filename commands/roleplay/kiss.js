const commando = require('discord.js-commando');

class KissCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'kiss', 
            group: 'roleplay',
            memberName: 'kiss',
            description: 'Kisses someone. (;kiss @User)',
            examples: [';kiss @User']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let username = message.content.split(" ").slice(1).join(" ");
        message.channel.sendMessage(message.author + ' *kisses* ' + username);
    }
}

module.exports = KissCommand;