const ImgurAlbumCommand = require('../../framework/Commands/ImgurAlbum');
const { WAVE_ALBUM_ID } = process.env;

module.exports = class WaveCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'wave',
			group: 'roleplay',
			memberName: 'wave',
			description: 'Waves at a user.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: WAVE_ALBUM_ID,
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
		return `_**${msg.author.username}** waves${noUserAuthor ? ` at **${user.username}**` : ''}._`;
	}
};
