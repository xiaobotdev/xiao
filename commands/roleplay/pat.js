const ImgurAlbumCommand = require('../../structures/commands/ImgurAlbum');
const { PAT_ALBUM_ID } = process.env;

module.exports = class PatCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'pat',
			group: 'roleplay',
			memberName: 'pat',
			description: 'Pats a user.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: PAT_ALBUM_ID,
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
		return `_**${msg.author.username}** pats **${user.username}**._`;
	}
};
