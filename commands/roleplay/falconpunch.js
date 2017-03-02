const commando = require('discord.js-commando');

class FalconPunchCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'falconpunch', 
            group: 'roleplay',
            memberName: 'falconpunch',
            description: 'Falcon Punches someone. (;falconpunch @User)',
            examples: [';falconpunch @User']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let username = message.content.split(" ").slice(1).join(" ");
        message.channel.sendMessage(message.author + ' *falcon punches* ' + username);
    }
}

module.exports = FalconPunchCommand;