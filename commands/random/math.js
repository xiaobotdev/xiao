const commando = require('discord.js-commando');
const math = require('mathjs');

class MathCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'math', 
            group: 'random',
            memberName: 'math',
            description: 'Does Math (;math 2 + 2)',
            examples: [';math 2 + 2']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let messagecontent = message.content.split(" ").slice(1).join(" ");
        try {
            let solved = math.eval(messagecontent);
            message.channel.sendMessage(solved).catch(error => message.channel.sendMessage(":x: Error! Invalid statment!"));
        } catch(err) {
            message.channel.sendMessage(":x: Error! Invalid statement!");
        }
    }
}

module.exports = MathCommand;