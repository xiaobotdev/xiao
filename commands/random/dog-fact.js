const Command = require('../../structures/Command');
const facts = require('../../assets/json/dog-fact');

module.exports = class DogFactCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dog-fact',
			aliases: ['puppy-fact'],
			group: 'random',
			memberName: 'dog-fact',
			description: 'Responds with a random dog fact.'
		});
	}

	run(msg) {
		return msg.say(facts[Math.floor(Math.random() * facts.length)]);
	}
};
