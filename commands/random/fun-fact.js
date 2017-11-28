const { Command } = require('discord.js-commando');
const facts = require('../../assets/json/fun-fact');

module.exports = class FunFactCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fun-fact',
			aliases: ['fact'],
			group: 'random',
			memberName: 'fun-fact',
			description: 'Responds with a random fun fact.'
		});
	}

	run(msg) {
		return msg.say(facts[Math.floor(Math.random() * facts.length)]);
	}
};
