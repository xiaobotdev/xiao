const ImgurAlbumCommand = require('../../structures/commands/ImgurAlbum');
const { XIAO_ALBUM_ID } = process.env;

module.exports = class XiaoCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'xiao',
			aliases: ['xiao-pai', 'iao'],
			group: 'random-img',
			memberName: 'xiao',
			description: 'Responds with a random image of Xiao Pai.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: XIAO_ALBUM_ID,
			credit: [
				{
					name: 'Marvelous',
					url: 'http://www.marv.jp/',
					reasonURL: 'http://www.runefactory4.com/index1.html',
					reason: 'Images, Original "Rune Factory 4" Game'
				}
			]
		});
	}

	generateText() {
		return 'It\'s me, yes?';
	}
};
