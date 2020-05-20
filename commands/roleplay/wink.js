const ImgurAlbumCommand = require('../../structures/commands/ImgurAlbum');
const { WINK_ALBUM_ID } = process.env;

module.exports = class WinkCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'wink',
			group: 'roleplay',
			memberName: 'wink',
			description: 'Winks at a user.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: WINK_ALBUM_ID,
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
		const noUserAuthor = msg.author.id !== user.id;
		return `_**${msg.author.username}** winks${noUserAuthor ? ` at **${user.username}**` : ''}._`;
	}
};
