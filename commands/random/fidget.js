const ImgurAlbumCommand = require('../../structures/commands/ImgurAlbum');
const { FIDGET_ALBUM_ID } = process.env;

module.exports = class FidgetCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'fidget',
			aliases: ['nimbat'],
			group: 'random',
			memberName: 'fidget',
			description: 'Responds with a random image of Fidget.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: FIDGET_ALBUM_ID
		});
	}

	generateText() {
		return 'Aren\'t Nimbats adorable?';
	}
};
