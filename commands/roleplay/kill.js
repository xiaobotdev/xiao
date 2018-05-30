const Command = require('../../structures/Command');
const { randomFromImgurAlbum } = require('../../util/Util');

module.exports = class KillCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kill',
			group: 'roleplay',
			memberName: 'kill',
			description: 'Kills a user.',
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
			const gif = await randomFromImgurAlbum('YhwEI');
			return msg.say(`_**${msg.author.username}** kills **${user.username}**._`, { files: [gif] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
