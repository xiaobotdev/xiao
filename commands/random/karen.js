const ImgurAlbumCommand = require('../../structures/commands/ImgurAlbum');
const { KAREN_ALBUM_ID } = process.env;

module.exports = class KarenCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'karen',
			aliases: ['ayaya'],
			group: 'random',
			memberName: 'karen',
			description: 'Responds with a random image of Karen.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: KAREN_ALBUM_ID,
			credit: [
				{
					name: 'KINMOZA!',
					url: 'http://www.kinmosa.com/',
					reason: 'Original Anime'
				}
			]
		});
	}

	generateText() {
		return 'Ayaya!';
	}
};
