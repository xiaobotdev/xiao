const Command = require('../../structures/Command');
const { randomFromImgurAlbum } = require('../../util/Util');

module.exports = class FidgetCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fidget',
			aliases: ['nimbat'],
			group: 'random',
			memberName: 'fidget',
			description: 'Responds with a random image of Fidget.',
			clientPermissions: ['ATTACH_FILES']
		});
	}

	async run(msg) {
		try {
			const nimbat = await randomFromImgurAlbum('DuO1T');
			return msg.say({ files: [nimbat] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
