const { Command } = require('discord.js-commando');

module.exports = class DickCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dick',
			aliases: ['dick-size'],
			group: 'random',
			memberName: 'dick',
			description: 'Determines your dick size.',
			nsfw: true
		});
	}

	run(msg) {
		return msg.say(`8${'='.repeat(Math.floor(Math.random() * 200) + 1)}D`);
	}
};
