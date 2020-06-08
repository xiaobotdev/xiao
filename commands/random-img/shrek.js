const ImgurAlbumCommand = require('../../structures/commands/ImgurAlbum');
const { SHREK_ALBUM_ID } = process.env;

module.exports = class ShrekCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'shrek',
			aliases: ['sexiest-man-alive', 'sexy'],
			group: 'random-img',
			memberName: 'shrek',
			description: 'Responds with a random image of Shrek, the sexiest man alive.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: SHREK_ALBUM_ID,
			credit: [
				{
					name: 'DreamWorks',
					url: 'https://www.dreamworks.com/',
					reasonURL: 'https://www.dreamworks.com/movies/shrek',
					reason: 'Images, Original "Shrek" Movie'
				}
			]
		});
	}

	generateText() {
		return 'Trust me, there is no one sexier than this man.';
	}
};
