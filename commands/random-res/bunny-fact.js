const Command = require('../../structures/Command');
const facts = require('../../assets/json/bunny-fact');

module.exports = class BunnyFactCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'bunny-fact',
			aliases: ['bun-fact', 'rabbit-fact'],
			group: 'random-res',
			memberName: 'bunny-fact',
			description: 'Responds with a random bunny fact.'
		});
	}

	run(msg) {
		return msg.say(facts[Math.floor(Math.random() * facts.length)]);
	}
};
