const { Command } = require('discord.js-commando');

module.exports = class EmojiListCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'emoji-list',
			aliases: ['emojis'],
			group: 'info',
			memberName: 'emoji-list',
			description: 'Responds with a list of the server\'s custom emoji.',
			guildOnly: true
		});
	}

	run(msg) {
		if (!msg.guild.emojis.size) return msg.say('This server has no custom emoji.');
		return msg.say(msg.guild.emojis.map(emoji => emoji.toString()).join(''));
	}
};
