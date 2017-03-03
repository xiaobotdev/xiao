const commando = require('discord.js-commando');
const WikiFakt = require('wikifakt');

class FactCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'fact', 
            group: 'response',
            memberName: 'fact',
            description: 'Gets a random fact. (;fact)',
            examples: [';fact']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        WikiFakt.preload = false;
        WikiFakt.getRandomFact().then(function(fact) {
            message.channel.sendMessage(fact);
        });
    }
}

module.exports = FactCommand;