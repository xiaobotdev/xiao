const commando = require('discord.js-commando');

class LennyCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'lenny', 
            group: 'random',
            memberName: 'lenny',
            description: 'Responds with the lenny face. (;lenny)',
            examples: [';lenny']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        message.channel.send('( ͡° ͜ʖ ͡°)');
    }
}

module.exports = LennyCommand;