const Command = require('../../structures/Command');
const { randomFromImgurAlbum } = require('../../util/Util');

module.exports = class MarryCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'marry',
			group: 'roleplay',
			memberName: 'marry',
			description: 'Marries a user.',
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
			const gif = await randomFromImgurAlbum('4H0EP');
			return msg.say(`_**${msg.author.username}** marries **${user.username}**._`, { files: [gif] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
