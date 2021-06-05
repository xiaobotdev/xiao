const ImgurAlbumCommand = require('../../structures/commands/ImgurAlbum');
const { SLAP_ALBUM_ID } = process.env;

module.exports = class SlapCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'slap',
			aliases: ['break-up', 'divorce'],
			group: 'roleplay',
			memberName: 'slap',
			description: 'Slaps a user.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: SLAP_ALBUM_ID,
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
		return `_**${msg.author.username}** slaps **${user.username}**._`;
	}
};
