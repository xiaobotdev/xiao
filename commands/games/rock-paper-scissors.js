const Command = require('../../structures/Command');
const choices = ['rock', 'paper', 'scissors'];

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
					prompt: 'Rock, Paper, or Scissors?',
					type: 'string',
					parse: choice => choice.toLowerCase()
				}
			]
		});
	}

	run(msg, args) {
		const { choice } = args;
		const response = choices[Math.floor(Math.random() * choices.length)];
		if (choice === 'rock') {
			if (response === 'rock') return msg.say('Rock! Aw... A tie...');
			if (response === 'paper') return msg.say('Paper! Yes! I win!');
			if (response === 'scissors') return msg.say('Scissors! Aw... I lose...');
		}
		if (choice === 'paper') {
			if (response === 'rock') return msg.say('Rock! Aw... I lose...');
			if (response === 'paper') return msg.say('Paper! Aw... A tie...');
			if (response === 'scissors') return msg.say('Scissors! Yes! I win!');
		}
		if (choice === 'scissors') {
			if (response === 'rock') return msg.say('Rock! Yes! I win!');
			if (response === 'paper') return msg.say('Paper! Aw... I lose...');
			if (response === 'scissors') return msg.say('Scissors! Aw... A tie...');
		}
		return msg.say('I win by default, you little cheater.');
	}
};
