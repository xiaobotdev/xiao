const ImgurAlbumCommand = require('../../structures/Commands/ImgurAlbum');
const { INHALE_ALBUM_ID } = process.env;

module.exports = class InhaleCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'inhale',
			group: 'roleplay',
			memberName: 'inhale',
			description: 'Inhales a user.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: INHALE_ALBUM_ID,
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
		return `_**${msg.author.username}** inhales **${user.username}** but gained no ability._`;
	}
};
