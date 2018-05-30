const Command = require('../../structures/Command');
const { randomFromImgurAlbum } = require('../../util/Util');

module.exports = class FistBumpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fist-bump',
			group: 'roleplay',
			memberName: 'fist-bump',
			description: 'Fistbumps a user.',
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
			const gif = await randomFromImgurAlbum('9D3WE');
			return msg.say(`_**${msg.author.username}** fist-bumps **${user.username}**._`, { files: [gif] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
