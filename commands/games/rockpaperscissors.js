const commando = require('discord.js-commando');

module.exports = class RockPaperScissors extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'rps',
            aliases: [
                'rockpaperscissors'
            ],
            group: 'games',
            memberName: 'rps',
            description: 'Play Rock Paper Scissors (;rps Rock)',
            examples: [';rps Rock'],
            args: [{
                key: 'choice',
                prompt: 'Rock, Paper, or Scissors?',
                type: 'string',
                validate: rps => {
                    if (rps.toLowerCase() === 'rock' || rps.toLowerCase() === 'paper' || rps.toLowerCase() === 'scissors') {
                        return true;
                    }
                    return 'Please enter either `rock`, `paper`, or `scissors`.';
                }
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        const rps = args.choice.toLowerCase();
        let response = ['Paper', 'Rock', 'Scissors'];
        response = response[Math.floor(Math.random() * response.length)];
        if (rps === "rock") {
            if (response === "Rock") {
                return message.say("Rock! Aw, it's a tie!");
            }
            if (response === "Paper") {
                return message.say("Paper! Yes! I win!");
            }
            if (response === "Scissors") {
                return message.say("Scissors! Aw... I lose...");
            }
        }
        else if (rps === "paper") {
            if (response === "Rock") {
                return message.say("Rock! Aw... I lose...");
            }
            if (response === "Paper") {
                return message.say("Paper! Aw, it's a tie!");
            }
            if (response === "Scissors") {
                return message.say("Scissors! Yes! I win!");
            }
        }
        else if (rps === "scissors") {
            if (response === "Rock") {
                return message.say("Rock! Yes! I win!");
            }
            if (response === "Paper") {
                return message.say("Paper! Aw... I lose...");
            }
            if (response === "Scissors") {
                return message.say("Scissors! Aw, it's a tie!");
            }
        }
    }
};
