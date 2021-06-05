const ImgurAlbumCommand = require('../../framework/Commands/ImgurAlbum');
const { FIDGET_ALBUM_ID } = process.env;

module.exports = class FidgetCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'fidget',
			aliases: ['nimbat'],
			group: 'random-img',
			memberName: 'fidget',
			description: 'Responds with a random image of Fidget.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: FIDGET_ALBUM_ID,
			credit: [
				{
					name: 'Dust: An Elysian Tail',
					url: 'https://www.noogy.com/main.html',
					reason: 'Original Game'
				}
			]
		});
	}

	generateText() {
		return 'Aren\'t Nimbats adorable?';
	}
};
