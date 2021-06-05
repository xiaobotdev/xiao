const ImgurAlbumCommand = require('../../framework/Commands/ImgurAlbum');
const { SMILE_ALBUM_ID } = process.env;

module.exports = class SmileCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'smile',
			group: 'roleplay',
			memberName: 'smile',
			description: 'Smiles at a user.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: SMILE_ALBUM_ID,
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
		return `_**${msg.author.username}** smiles${noUserAuthor ? ` at **${user.username}**` : ''}._`;
	}
};
