const commando = require('discord.js-commando');

class PatCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'pat', 
            group: 'roleplay',
            memberName: 'pat',
            description: 'Pats someone. (;pat @User)',
            examples: [';pat @User']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let username = message.content.split(" ").slice(1).join(" ");
        message.channel.sendMessage(message.author + ' *pats* ' + username);
    }
}

module.exports = PatCommand;