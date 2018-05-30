const Command = require('../../structures/Command');
const { randomFromImgurAlbum } = require('../../util/Util');

module.exports = class CuddleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cuddle',
			group: 'roleplay',
			memberName: 'cuddle',
			description: 'Cuddles a user.',
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
			const gif = await randomFromImgurAlbum('sVjXp');
			return msg.say(`_**${msg.author.username}** cuddles with **${user.username}**._`, { files: [gif] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
