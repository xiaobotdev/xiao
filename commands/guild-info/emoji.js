const Command = require('../../structures/Command');

module.exports = class EmojiCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'emoji',
			group: 'guild-info',
			memberName: 'emoji',
			description: 'Responds with a list of the server\'s custom emoji.',
			guildOnly: true
		});
	}

	run(msg) {
		if (!msg.guild.emojis.size) return msg.say('This server has no custom emoji.');
		return msg.say(msg.guild.emojis.map(e => e).join(''));
	}
};
