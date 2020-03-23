const ImgurAlbumCommand = require('../../structures/commands/ImgurAlbum');
const { LANDO_ALBUM_ID } = process.env;

module.exports = class LandoCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'lando',
			aliases: ['lando-calrissian', 'calrissian'],
			group: 'random-img',
			memberName: 'lando',
			description: 'Responds with a random image of Lando Calrissian.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: LANDO_ALBUM_ID,
			credit: [
				{
					name: 'Star Wars',
					url: 'https://www.starwars.com/',
					reason: 'Original Movie'
				}
			]
		});
	}

	generateText() {
		return 'How you doin\', ya old pirate? So good to see ya!';
	}
};
