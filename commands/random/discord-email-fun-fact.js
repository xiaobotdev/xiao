const Command = require('../../structures/Command');
const facts = require('../../assets/json/discord-email-fun-fact');

module.exports = class DiscordEmailFunFactCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'discord-email-fun-fact',
			aliases: ['email-fun-fact'],
			group: 'random',
			memberName: 'discord-email-fun-fact',
			description: 'Responds with a random fun fact from the Discord emails.'
		});
	}

	run(msg) {
		const factNumber = Math.floor(Math.random() * facts.length);
		return msg.say(`**Fun Fact #${factNumber + 1}:** ${facts[factNumber]}`);
	}
};
