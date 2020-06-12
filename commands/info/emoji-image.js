const Command = require('../../structures/Command');

module.exports = class EmojiImageCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'emoji-image',
			aliases: ['big-emoji', 'emote-image', 'big-emote', 'emoji-img', 'emote-img'],
			group: 'info',
			memberName: 'emoji-image',
			description: 'Responds with an emoji\'s full-scale image.',
			guildOnly: true,
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'emoji',
					prompt: 'Which emoji would you like to get the image of?',
					type: 'custom-emoji',
					default: msg => msg.guild.emojis.cache.random()
				}
			]
		});
	}

	run(msg, { emoji }) {
		return msg.say({ files: [emoji.url] });
	}
};
