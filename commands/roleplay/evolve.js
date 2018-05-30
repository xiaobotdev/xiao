const Command = require('../../structures/Command');
const { randomFromImgurAlbum } = require('../../util/Util');

module.exports = class EvolveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'evolve',
			group: 'roleplay',
			memberName: 'evolve',
			description: 'Evolves a user.',
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
			const gif = await randomFromImgurAlbum('QaDeO');
			return msg.say(`_**${user.username}** is evolving!_`, { files: [gif] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
