const commando = require('discord.js-commando');

class FishyCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'roulette', 
            group: 'response',
            memberName: 'roulette',
            description: 'Chooses a random member. (;roulette Who is the best?)',
            examples: [";roulette Who is the best?"]
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        message.reply("I choose " + message.guild.members.random() + "!");
    }
}

module.exports = FishyCommand;