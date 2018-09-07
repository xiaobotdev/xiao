const Command = require('../../structures/Command');

module.exports = class EmojiImageCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'emoji-image',
			aliases: ['bigify-emoji', 'emoji-url', 'big-emoji'],
			group: 'info',
			memberName: 'emoji-image',
			description: 'Responds with an emoji\'s full-scale image.',
			guildOnly: true,
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'emoji',
					prompt: 'Which emoji would you like to get the image of?',
					type: 'emoji'
				}
			]
		});
	}

	run(msg, { emoji }) {
		return msg.say({ files: [emoji.url] });
	}
};
