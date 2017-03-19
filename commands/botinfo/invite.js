const commando = require('discord.js-commando');

class InviteCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'invite', 
            group: 'botinfo',
            memberName: 'invite',
            description: 'Sends you an invite for the bot, or an invite to my server, Heroes of Dreamland. (;invite)',
            examples: [';invite']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        message.channel.send("\nAdd me to your server with this link:\n" + "https://discordapp.com/oauth2/authorize?client_id=278305350804045834&scope=bot&permissions=1345846343" + "\nOr, come to my server with this link:\n" + "https://discord.gg/fqQF8mc");
    }
}

module.exports = InviteCommand;