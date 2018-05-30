const Command = require('../../structures/Command');
const { randomFromImgurAlbum } = require('../../util/Util');

module.exports = class PatCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pat',
			group: 'roleplay',
			memberName: 'pat',
			description: 'Pats a user.',
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
			const gif = await randomFromImgurAlbum('JPwZG');
			return msg.say(`_**${msg.author.username}** pats **${user.username}**._`, { files: [gif] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
