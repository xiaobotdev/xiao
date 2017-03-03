const commando = require('discord.js-commando');

class MagicBall extends commando.Command {
    constructor(Client){
        super(Client, {
            name: '8ball', 
            group: 'response',
            memberName: '8ball',
            description: 'Predicts your future. (;8ball Am I stupid?)',
            examples: [';8ball <INSERT QUESTION HERE>']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let question = message.content.split(" ").slice(1).join(" ");
        let coin = ['It seems the answer is yes, yes?', 'It seems the answer is no.', 'It is a little doubtful, yes?', 'It seems it is very likely to be true.'][Math.floor(Math.random() * 4)];
        if(question === "") {
            question = "Not Specified."
        }
        message.channel.sendMessage("Question: " + question + "\n:8ball: " + coin + " :8ball:");
    }
}

module.exports = MagicBall;