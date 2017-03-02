const commando = require('discord.js-commando');

class GiveFlowerCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'giveflower', 
            group: 'random',
            memberName: 'giveflower',
            description: 'Gives Xiao Pai a flower. (;giveflower)',
            examples: [';giveflower']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        message.reply('Ooh, what a pretty flower. What, I may have it? Thanks! I like flowers, yes? ♪');
    }
}

module.exports = GiveFlowerCommand;