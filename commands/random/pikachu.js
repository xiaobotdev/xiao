const Command = require('../../structures/Command');
const { randomFromImgurAlbum } = require('../../util/Util');

module.exports = class PikachuCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pikachu',
			aliases: ['pika'],
			group: 'random',
			memberName: 'pikachu',
			description: 'Responds with a random image of Pikachu.',
			clientPermissions: ['ATTACH_FILES']
		});
	}

	async run(msg) {
		try {
			const pikachu = await randomFromImgurAlbum('qtk2J');
			return msg.say({ files: [pikachu] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
