const Command = require('../../structures/Command');
const choices = ['paper', 'rock', 'scissors'];

module.exports = class RockPaperScissorsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'rock-paper-scissors',
            aliases: ['rps'],
            group: 'games',
            memberName: 'rock-paper-scissors',
            description: 'Play Rock-Paper-Scissors.',
            args: [
                {
                    key: 'choice',
                    prompt: '`Rock`, `Paper`, or `Scissors`?',
                    type: 'string',
                    validate: (choice) => {
                        if (choices.includes(choice.toLowerCase())) {
                            return true;
                        } else {
                            return 'Please enter either `rock`, `paper`, or `scissors`.';
                        }
                    },
                    parse: (choice) => choice.toLowerCase()
                }
            ]
        });
    }

    run(msg, args) {
        const { choice } = args;
        const response = choices[Math.floor(Math.random() * choices.length)];
        if (choice === 'rock') {
            if (response === 'rock') {
                return msg.say('Rock! Aw... A tie...');
            } else if (response === 'paper') {
                return msg.say('Paper! Yes! I win!');
            } else if (response === 'scissors') {
                return msg.say('Scissors! Aw... I lose...');
            }
        } else if (choice === 'paper') {
            if (response === 'rock') {
                return msg.say('Rock! Aw... I lose...');
            } else if (response === 'paper') {
                return msg.say('Paper! Aw... A tie...');
            } else if (response === 'scissors') {
                return msg.say('Scissors! Yes! I win!');
            }
        } else if (choice === 'scissors') {
            if (response === 'rock') {
                return msg.say('Rock! Yes! I win!');
            } else if (response === 'paper') {
                return msg.say('Paper! Aw... I lose...');
            } else if (response === 'scissors') {
                return msg.say('Scissors! Aw... A tie...');
            }
        }
    }
};
