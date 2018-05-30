const Command = require('../../structures/Command');
const { randomFromImgurAlbum } = require('../../util/Util');

module.exports = class HitWithShovelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hit-with-shovel',
			group: 'roleplay',
			memberName: 'hit-with-shovel',
			description: 'Hits a user with a shovel.',
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
			const gif = await randomFromImgurAlbum('IA35f');
			return msg.say(`_**${msg.author.username}** hits **${user.username}** with a shovel._`, { files: [gif] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
