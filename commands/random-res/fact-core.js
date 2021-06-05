const Command = require('../../framework/Command');
const facts = require('../../assets/json/fact-core');

module.exports = class FactCoreCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fact-core',
			group: 'random-res',
			memberName: 'fact-core',
			description: 'Responds with a random Fact Core quote.',
			credit: [
				{
					name: 'Valve',
					url: 'https://www.valvesoftware.com/en/',
					reasonURL: 'http://www.thinkwithportals.com/',
					reason: 'Original "Portal 2" Game'
				}
			]
		});
	}

	run(msg) {
		return msg.say(facts[Math.floor(Math.random() * facts.length)]);
	}
};
