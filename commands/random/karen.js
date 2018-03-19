const { Command } = require('discord.js-commando');
const { randomFromImgurAlbum } = require('../../util/Util');

module.exports = class KarenCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'karen',
			aliases: ['ayaya'],
			group: 'random',
			memberName: 'karen',
			description: 'Responds with a random image of Karen.',
			clientPermissions: ['ATTACH_FILES']
		});
	}

	async run(msg) {
		try {
			const karen = await randomFromImgurAlbum('3oLAP');
			return msg.say({ files: [karen] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
