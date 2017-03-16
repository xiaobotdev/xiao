const commando = require('discord.js-commando');

class ChooseCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'choose', 
            group: 'response',
            memberName: 'choose',
            description: 'Chooses between two things. (;choose Cow | Sheep)',
            examples: [';choose Cow | Sheep']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        if(message.content.includes("|")) {
            let choice2 = message.content.split("|").slice(1).join(" ");
            let choice1 = " " + message.content.replace(choice2, "").split(" ").slice(1).join(" ");
            let coin = [choice1, choice2];
            coin = coin[Math.floor(Math.random() * coin.length)];
            message.channel.send("I choose" + coin.replace("|", ""));
        } else {
            message.channel.send(":x: Split your two choices with a ' | '!");
        }
    }
}

module.exports = ChooseCommand;