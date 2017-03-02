const commando = require('discord.js-commando');

class MotivateCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'motivate', 
            group: 'response',
            memberName: 'motivate',
            description: 'Motivates someone. (;motivate @User)',
            examples: [';motivate @User']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let username = message.content.split(" ").slice(1).join(" ");
        let coin = ['https://www.youtube.com/watch?v=ZXsQAXx_ao0'][Math.floor(Math.random() * 1)];
        if(username === '') {
            message.reply(coin);
        } else {
            message.channel.sendMessage(username + ", " + coin);
        }
    }
}

module.exports = MotivateCommand;