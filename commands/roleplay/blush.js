const ImgurAlbumCommand = require('../../structures/commands/ImgurAlbum');
const { BLUSH_ALBUM_ID } = process.env;

module.exports = class BlushCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'blush',
			group: 'roleplay',
			memberName: 'blush',
			description: 'Blushes at a user.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: BLUSH_ALBUM_ID,
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
		return `_**${msg.author.username}** blushes${noUserAuthor ? ` at **${user.username}**` : ''}._`;
	}
};
