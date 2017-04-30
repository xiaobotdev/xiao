const { Command } = require('discord.js-commando');
const responses = ['Paper', 'Rock', 'Scissors'];

module.exports = class RockPaperScissorsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'rps',
            aliases: [
                'rockpaperscissors'
            ],
            group: 'games',
            memberName: 'rps',
            description: 'Play Rock-Paper-Scissors.',
            args: [{
                key: 'choice',
                prompt: '`Rock`, `Paper`, or `Scissors`?',
                type: 'string',
                validate: choice => {
                    if (['rock', 'paper', 'scissors'].includes(choice.toLowerCase()))
                        return true;
                    return 'Please enter either `rock`, `paper`, or `scissors`.';
                },
                parse: choice => choice.toLowerCase()
            }]
        });
    }

    run(msg, args) {
        const { choice } = args;
        const response = responses[Math.floor(Math.random() * responses.length)];
        if (choice === 'rock') {
            if (response === 'Rock')
                return msg.say('Rock! Aw, it\'s a tie!');
            if (response === 'Paper')
                return msg.say('Paper! Yes! I win!');
            if (response === 'Scissors')
                return msg.say('Scissors! Aw... I lose...');
        } else if (choice === 'paper') {
            if (response === 'Rock')
                return msg.say('Rock! Aw... I lose...');
            if (response === 'Paper')
                return msg.say('Paper! Aw, it\'s a tie!');
            if (response === 'Scissors')
                return msg.say('Scissors! Yes! I win!');
        } else if (choice === 'scissors') {
            if (response === 'Rock')
                return msg.say('Rock! Yes! I win!');
            if (response === 'Paper')
                return msg.say('Paper! Aw... I lose...');
            if (response === 'Scissors')
                return msg.say('Scissors! Aw, it\'s a tie!');
        }
    }
};
