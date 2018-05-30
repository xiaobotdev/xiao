const Command = require('../../structures/Command');
const { randomFromImgurAlbum } = require('../../util/Util');

module.exports = class HugCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hug',
			group: 'roleplay',
			memberName: 'hug',
			description: 'Hugs a user.',
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
			const gif = await randomFromImgurAlbum('v4Sdd');
			return msg.say(`_**${msg.author.username}** hugs **${user.username}**._`, { files: [gif] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
