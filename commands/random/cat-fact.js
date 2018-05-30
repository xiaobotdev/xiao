const Command = require('../../structures/Command');
const facts = require('../../assets/json/cat-fact');

module.exports = class CatFactCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cat-fact',
			aliases: ['neko-fact', 'kitty-fact'],
			group: 'random',
			memberName: 'cat-fact',
			description: 'Responds with a random cat fact.'
		});
	}

	run(msg) {
		return msg.say(facts[Math.floor(Math.random() * facts.length)]);
	}
};
