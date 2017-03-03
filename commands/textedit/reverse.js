const commando = require('discord.js-commando');

class ReverseCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'reverse', 
            group: 'textedit',
            memberName: 'reverse',
            description: 'Reverses text (;reverse This text please)',
            examples: [';reverse This text please']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        function reverseString(str) {
            return str.split("").reverse().join("");
        }
        let messagecontent = message.content.split(" ").slice(1).join(" ");
        if(messagecontent === "") {
            message.channel.sendMessage(":x: Error! Nothing to reverse!");
        } else {
            let reversed = reverseString(messagecontent);
            message.channel.sendMessage(reversed);
        }
    }
}

module.exports = ReverseCommand;