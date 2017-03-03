const commando = require('discord.js-commando');

class PotatoCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'potato', 
            group: 'response',
            memberName: 'potato',
            description: 'Sends a random Potato picture. (;potato)',
            examples: [';potato']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('ATTACH_FILES')) return;
        }
        console.log("[Command] " + message.content);
        let potato = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.gif", "6.png", "7.jpg", "8.jpg", "9.jpg"][Math.floor(Math.random() * 9)];
        message.channel.sendFile("./images/Potato" + potato);
    }
}

module.exports = PotatoCommand;