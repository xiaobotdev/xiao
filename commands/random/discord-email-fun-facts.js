const { Command } = require('discord.js-commando');
const facts = require('../../assets/json/discord-email-fun-facts');

module.exports = class DiscordEmailFunFactsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'discord-email-fun-facts',
			aliases: ['email-fun-facts'],
			group: 'random',
			memberName: 'discord-email-fun-facts',
			description: 'Responds with a random fun fact from the Discord emails.'
		});
	}

	run(msg) {
		const factNumber = Math.floor(Math.random() * facts.length);
		return msg.say(`**Fun Fact #${factNumber + 1}**: ${facts[factNumber]}`);
	}
};
