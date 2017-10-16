const { Command } = require('discord.js-commando');
const jokes = require('../../assets/json/joke');

module.exports = class JokeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'joke',
			group: 'random-res',
			memberName: 'joke',
			description: 'Responds with a random joke.'
		});
	}

	run(msg) {
		return msg.say(jokes[Math.floor(Math.random() * jokes.length)]);
	}
};
