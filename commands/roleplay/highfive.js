const commando = require('discord.js-commando');

class HighFivesCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'highfive', 
            group: 'roleplay',
            memberName: 'highfive',
            description: 'High Fives someone. (;highfive @User)',
            examples: [';highfive @User']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let username = message.content.split(" ").slice(1).join(" ");
        message.channel.send(message.author + ' *high fives* ' + username);
    }
}

module.exports = HighFivesCommand;