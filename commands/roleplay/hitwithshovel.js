const commando = require('discord.js-commando');

class HitwithShovelCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'hitwithshovel', 
            group: 'roleplay',
            memberName: 'hitwithsovel',
            description: 'Hits someone with a shovel. (;hitwithshovel @User)',
            examples: [';hitwithshovel @User']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let username = message.content.split(" ").slice(1).join(" ");
        message.channel.send(message.author + ' *hits* ' + username + ' *with a shovel* ');
    }
}

module.exports = HitwithShovelCommand;