const Command = require('../../structures/Command');
const { randomFromImgurAlbum } = require('../../util/Util');

module.exports = class HoldHandsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hold-hands',
			aliases: ['hold-hand'],
			group: 'roleplay',
			memberName: 'hold-hands',
			description: 'Holds hands with a user.',
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
			const gif = await randomFromImgurAlbum('K67Lp');
			return msg.say(`_**${msg.author.username}** holds **${user.username}**'s hand._`, { files: [gif] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
