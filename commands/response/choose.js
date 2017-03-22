const commando = require('discord.js-commando');

module.exports = class ChooseCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'choose',
            aliases: [
                'pick'
            ],
            group: 'response',
            memberName: 'choose',
            description: 'Chooses between two things. (;choose Cow | Sheep)',
            examples: [';choose Cow | Sheep']
        });
    }

    async run(message) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log("[Command] " + message.content);
        if(message.content.includes(" | ")) {
            let choices = message.content.split(" ").slice(1).join(" ").split(' | ');
            let choice1 = choices[0];
            let choice2 = choices[1];
            let randomChoice = [choice1, choice2];
            randomChoice = randomChoice[Math.floor(Math.random() * randomChoice.length)];
            message.channel.send("I choose " + randomChoice + "!");
        } else {
            message.channel.send(":x: Split your two choices with a ' | '!");
        }
    }
};