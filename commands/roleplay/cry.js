const ImgurAlbumCommand = require('../../framework/Commands/ImgurAlbum');
const { CRY_ALBUM_ID } = process.env;

module.exports = class CryCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'cry',
			group: 'roleplay',
			memberName: 'cry',
			description: 'Cries at a user.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: CRY_ALBUM_ID,
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
		const noUserAuthor = msg.author.id !== user.id;
		return `_**${msg.author.username}** cries${noUserAuthor ? ` at **${user.username}**` : ''}._`;
	}
};
