const commando = require('discord.js-commando');
const cowsay = require('cowsay');

class CowsayCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'cowsay', 
            group: 'textedit',
            memberName: 'cowsay',
            description: 'Converts text to cowsay. (;cowsay This text)',
            examples: [';cowsay This text']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        if(message.content.split(" ").slice(1).join(" ") === "") {
            message.channel.sendMessage(":x: Error! You entered nothing!");
        } else {
            let turnToCowsay = message.content.split(" ").slice(1).join(" ");
            message.channel.sendCode(null, cowsay.say({
                text : turnToCowsay,
                e : "oO",
                T : "U "
            })).catch(error => {
                message.channel.sendMessage(':x: Error! Perhaps the content is too long?');
            });
        }
    }
}

module.exports = CowsayCommand;