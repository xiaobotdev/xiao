const Command = require('../../structures/Command');
const { randomFromImgurAlbum } = require('../../util/Util');

module.exports = class BreakUpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'break-up',
			aliases: ['divorce'],
			group: 'roleplay',
			memberName: 'break-up',
			description: 'Breaks up with a user.',
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
			const gif = await randomFromImgurAlbum('QFWUb');
			return msg.say(`_**${msg.author.username}** breaks up with **${user.username}**._`, { files: [gif] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
