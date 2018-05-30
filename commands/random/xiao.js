const Command = require('../../structures/Command');
const { randomFromImgurAlbum } = require('../../util/Util');

module.exports = class XiaoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'xiao',
			aliases: ['xiao-pai', 'iao'],
			group: 'random',
			memberName: 'xiao',
			description: 'Responds with a random image of Xiao Pai.',
			clientPermissions: ['ATTACH_FILES']
		});
	}

	async run(msg) {
		try {
			const xiao = await randomFromImgurAlbum('S4e3r');
			return msg.say({ files: [xiao] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
