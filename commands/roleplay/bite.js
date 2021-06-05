const ImgurAlbumCommand = require('../../framework/Commands/ImgurAlbum');
const { BITE_ALBUM_ID } = process.env;

module.exports = class BiteCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'bite',
			aliases: ['nom'],
			group: 'roleplay',
			memberName: 'bite',
			description: 'Bites a user.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: BITE_ALBUM_ID,
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
		return `_**${msg.author.username}** bites **${user.username}**._`;
	}
};
