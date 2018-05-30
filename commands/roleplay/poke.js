const Command = require('../../structures/Command');
const { randomFromImgurAlbum } = require('../../util/Util');

module.exports = class PokeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'poke',
			group: 'roleplay',
			memberName: 'poke',
			description: 'Pokes a user.',
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
			const gif = await randomFromImgurAlbum('ek91V');
			return msg.say(`_**${msg.author.username}** pokes **${user.username}**._`, { files: [gif] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
