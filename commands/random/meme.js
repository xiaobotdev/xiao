const ImgurAlbumCommand = require('../../structures/commands/ImgurAlbum');
const { POSTER_ALBUM_ID } = process.env;

module.exports = class MemeCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'meme',
			group: 'random',
			memberName: 'meme',
			description: 'Responds with a random meme.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: POSTER_ALBUM_ID
		});
	}

	generateText() {
		return '';
	}
};
