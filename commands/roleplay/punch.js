const Command = require('../../structures/Command');
const { randomFromImgurAlbum } = require('../../util/Util');

module.exports = class PunchCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'punch',
			group: 'roleplay',
			memberName: 'punch',
			description: 'Punches a user.',
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
			const gif = await randomFromImgurAlbum('mZrp8');
			return msg.say(`_**${msg.author.username}** punches **${user.username}**._`, { files: [gif] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
