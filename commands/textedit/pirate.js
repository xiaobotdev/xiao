const commando = require('discord.js-commando');
const pirateSpeak = require('pirate-speak');

class PirateCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'pirate', 
            group: 'textedit',
            memberName: 'pirate',
            description: 'Talk like a pirate! (;pirate This is being said like a pirate!)',
            examples: [';pirate This is being said like a pirate!']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let messagecontent = message.content.split(" ").slice(1).join(" ");
        let pirate = pirateSpeak.translate(messagecontent);
        if(messagecontent === "") {
            message.channel.sendMessage(":x: Error! Nothing to translate!");
        } else {
            message.channel.sendMessage(pirate, {split:true});
        }
    }
}

module.exports = PirateCommand;