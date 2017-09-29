const { Command } = require('discord.js-commando');
const facts = require('../../assets/json/cat-fact');

module.exports = class CatFactCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cat-fact',
			aliases: ['neko-fact', 'kitty-fact'],
			group: 'random-res',
			memberName: 'cat-fact',
			description: 'Responds with a cat fact.'
		});
	}

	run(msg) {
		return msg.say(facts[Math.floor(Math.random() * facts.length)]);
	}
};
