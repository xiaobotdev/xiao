const commando = require('discord.js-commando');

class RateWaifuCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'ratewaifu', 
            group: 'response',
            memberName: 'ratewaifu',
            description: 'Rates your Waifu. (;ratewaifu Xiao Pai)',
            examples: [';ratewaifu Xiao Pai']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let username = message.content.split(" ").slice(1).join(" ");
        let percentage = Math.floor(Math.random() * 10) + 1;
        message.reply("I'd give " + username + " a " + percentage + "/10!");
    }
}

module.exports = RateWaifuCommand;