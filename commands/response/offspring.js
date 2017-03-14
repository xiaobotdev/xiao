const commando = require('discord.js-commando');

class OffspringCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'offspring', 
            group: 'response',
            memberName: 'offspring',
            description: 'Tells you if your new child is a boy or a girl. (;offspring)',
            examples: [';offspring']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let gender = ['boy', 'girl'];
        gender = gender[Math.floor(Math.random() * gender.length)];
        message.channel.sendMessage("It's a " + gender + "!");
    }
}

module.exports = OffspringCommand;