const ImgurAlbumCommand = require('../../framework/Commands/ImgurAlbum');
const { POTATO_ALBUM_ID } = process.env;

module.exports = class PotatoCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'potato',
			group: 'random-img',
			memberName: 'potato',
			description: 'Responds with a random potato image.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: POTATO_ALBUM_ID
		});
	}

	generateText() {
		return 'I like potatoes.';
	}
};
