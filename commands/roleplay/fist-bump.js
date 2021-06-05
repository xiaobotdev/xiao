const ImgurAlbumCommand = require('../../structures/Commands/ImgurAlbum');
const { FIST_BUMP_ALBUM_ID } = process.env;

module.exports = class FistBumpCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'fist-bump',
			group: 'roleplay',
			memberName: 'fist-bump',
			description: 'Fist-bumps a user.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: FIST_BUMP_ALBUM_ID,
			args: [
				{
					key: 'user',
					prompt: 'What user do you want to roleplay with?',
					type: 'user'
				}
			]
		});
	}

	generateText(msg, user) {
		return `_**${msg.author.username}** fist-bumps **${user.username}**._`;
	}
};
