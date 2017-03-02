const commando = require('discord.js-commando');

class RockPaperScissors extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'rps', 
            group: 'response',
            memberName: 'rps',
            description: 'Play Rock Paper Scissors (;rps Rock)',
            examples: [';rps Rock']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let [rps] = message.content.toLowerCase().split(" ").slice(1);
        let response = ['Paper', 'Rock', 'Scissors'][Math.floor(Math.random() * 3)];
        if(rps === undefined) {
            message.reply(":x: Error! Your message contains nothing!");
        } else if(rps.includes("rock")) {
            if(response === "Rock") {
                message.reply("Rock! Aw, it's a tie!");
            }
            if(response === "Paper") {
                message.reply("Paper! Yes! I win!");
            }
            if(response === "Scissors") {
                message.reply("Scissors! Aw... I lose...");
            }
        } else if(rps.includes("paper")) {
            if(response === "Rock") {
                message.reply("Rock! Aw... I lose...");
            }
            if(response === "Paper") {
                message.reply("Paper! Aw, it's a tie!");
            }
            if(response === "Scissors") {
                message.reply("Scissors! Yes! I win!");
            }
        } else if(rps.includes("scissors")) {
            if(response === "Rock") {
                message.reply("Rock! Yes! I win!");
            }
            if(response === "Paper") {
                message.reply("Paper! Aw... I lose...");
            }
            if(response === "Scissors") {
                message.reply("Scissors! Aw, it's a tie!");
            }
        } else {
            message.reply(":x: Error! Your choice is not Rock, Paper, or Scissors!");
        }
    }
}

module.exports = RockPaperScissors;