const Command = require('../../structures/Command');
const { randomFromImgurAlbum } = require('../../util/Util');

module.exports = class SlapCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'slap',
			group: 'roleplay',
			memberName: 'slap',
			description: 'Slaps a user.',
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
			const gif = await randomFromImgurAlbum('6wu9G');
			return msg.say(`_**${msg.author.username}** slaps **${user.username}**._`, { files: [gif] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
