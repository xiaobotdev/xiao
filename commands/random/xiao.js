const ImgurAlbumCommand = require('../../structures/commands/ImgurAlbum');
const { XIAO_ALBUM_ID } = process.env;

module.exports = class XiaoCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'xiao',
			aliases: ['xiao-pai', 'iao'],
			group: 'random',
			memberName: 'xiao',
			description: 'Responds with a random image of Xiao Pai.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: XIAO_ALBUM_ID
		});
	}

	generateText() {
		return 'It\'s me, yes?';
	}
};
