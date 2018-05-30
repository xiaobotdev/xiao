const Command = require('../../structures/Command');
const { randomFromImgurAlbum } = require('../../util/Util');

module.exports = class InhaleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'inhale',
			group: 'roleplay',
			memberName: 'inhale',
			description: 'Inhales a user.',
			args: [
				{
					key: 'user',
					prompt: 'What user do you want to roleplay with?',
					type: 'user'
				}
			]
		});
	}

	async run(msg, { user }) {
		try {
			const gif = await randomFromImgurAlbum('QKFM6');
			return msg.say(
				`_**${msg.author.username}** inhales **${user.username}** but gained no ability..._`,
				{ files: [gif] }
			);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
