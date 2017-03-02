const commando = require('discord.js-commando');

class SpamCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'spam', 
            group: 'random',
            memberName: 'spam',
            description: 'Puts a picture of Spam. (;spam)',
            examples: [';spam']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('ATTACH_FILES')) return;
        }
        console.log("[Command] " + message.content);
        message.reply("Spam!");
        message.channel.sendFile("./images/Spam.jpg");
    }
}

module.exports = SpamCommand;