const commando = require('discord.js-commando');

class SlapCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'slap', 
            group: 'roleplay',
            memberName: 'slap',
            description: 'Slaps someone. (;slap @User)',
            examples: [';slap @User']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let username = message.content.split(" ").slice(1).join(" ");
        message.channel.send(message.author + ' *slaps* ' + username);
    }
}

module.exports = SlapCommand;