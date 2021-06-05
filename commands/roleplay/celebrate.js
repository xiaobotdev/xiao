const ImgurAlbumCommand = require('../../structures/Commands/ImgurAlbum');
const { CELEBRATE_ALBUM_ID } = process.env;

module.exports = class CelebrateCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'celebrate',
			aliases: ['party'],
			group: 'roleplay',
			memberName: 'celebrate',
			description: 'Celebrates.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: CELEBRATE_ALBUM_ID,
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
		return `_**${msg.author.username}** celebrates${noUserAuthor ? ` with **${user.username}**` : ''}._`;
	}
};
