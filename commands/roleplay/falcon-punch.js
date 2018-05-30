const Command = require('../../structures/Command');
const { randomFromImgurAlbum } = require('../../util/Util');

module.exports = class FalconPunchCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'falcon-punch',
			group: 'roleplay',
			memberName: 'falcon-punch',
			description: 'Falcon Punches a user.',
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
			const gif = await randomFromImgurAlbum('mJauN');
			return msg.say(`_**${msg.author.username}** falcon punches **${user.username}**._`, { files: [gif] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
