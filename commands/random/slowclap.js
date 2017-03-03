const commando = require('discord.js-commando');

class SlowClapCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'slowclap', 
            group: 'random',
            memberName: 'slowclap',
            description: '*Slow Clap*. (;slowclap)',
            examples: [';slowclap']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        message.channel.sendMessage('*slow clap*');
    }
}

module.exports = SlowClapCommand;