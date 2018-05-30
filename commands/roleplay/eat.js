const Command = require('../../structures/Command');
const { randomFromImgurAlbum } = require('../../util/Util');

module.exports = class EatCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'eat',
			group: 'roleplay',
			memberName: 'eat',
			description: 'Eats a user.',
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
			const gif = await randomFromImgurAlbum('GP2zD');
			return msg.say(`_**${msg.author.username}** eats **${user.username}**._`, { files: [gif] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
