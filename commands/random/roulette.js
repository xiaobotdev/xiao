const { Command } = require('discord.js-commando');

module.exports = class RouletteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'roulette',
			group: 'random',
			memberName: 'roulette',
			description: 'Randomly chooses a member of the server.',
			guildOnly: true
		});
	}

	run(msg) {
		return msg.say(`I choose ${msg.guild.members.random().displayName}!`);
	}
};
