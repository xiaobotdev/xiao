const commando = require('discord.js-commando');

class ShipCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'ship', 
            group: 'response',
            memberName: 'ship',
            description: 'Ships two people. (;ship @Rem and @Nate)',
            examples: [';ship @Rem and @Nate']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let ship = message.content.split(" ").slice(1).join(" ");
        let percentage = Math.floor(Math.random() * 100) + 1;
        message.channel.sendMessage("I'd give " + ship + " a " + percentage + "%!");
    }
}

module.exports = ShipCommand;