const ImgurAlbumCommand = require('../../structures/commands/ImgurAlbum');
const { EAT_ALBUM_ID } = process.env;

module.exports = class EatCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'eat',
			group: 'roleplay',
			memberName: 'eat',
			description: 'Feeds a user.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: EAT_ALBUM_ID,
			args: [
				{
					key: 'user',
					prompt: 'What user do you want to roleplay with?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	generateText(msg, user) {
		return `_**${user.username}** eats._`;
	}
};
