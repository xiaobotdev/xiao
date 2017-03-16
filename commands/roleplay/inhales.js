const commando = require('discord.js-commando');

class InhaleCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'inhale', 
            group: 'roleplay',
            memberName: 'inhale',
            description: 'Inhales someone. (;inhale @User)',
            examples: [';inhale @User']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let username = message.content.split(" ").slice(1).join(" ");
        message.channel.send(message.author + ' *inhales* ' + username + ' *but gained no ability...* ');
    }
}

module.exports = InhaleCommand;