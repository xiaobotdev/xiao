const ImgurAlbumCommand = require('../../structures/commands/ImgurAlbum');
const { HIGH_FIVE_ALBUM_ID } = process.env;

module.exports = class HighFiveCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'high-five',
			group: 'roleplay',
			memberName: 'high-five',
			description: 'High Fives a user.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: HIGH_FIVE_ALBUM_ID,
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
		return `_**${msg.author.username}** high-fives **${user.username}**._`;
	}
};
