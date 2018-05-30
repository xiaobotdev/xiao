const Command = require('../../structures/Command');
const { randomFromImgurAlbum } = require('../../util/Util');

module.exports = class HighFiveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'high-five',
			group: 'roleplay',
			memberName: 'high-five',
			description: 'High Fives a user.',
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
			const gif = await randomFromImgurAlbum('1Dotc');
			return msg.say(`_**${msg.author.username}** high-fives **${user.username}**._`, { files: [gif] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
