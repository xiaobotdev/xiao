const ImgurAlbumCommand = require('../../structures/commands/ImgurAlbum');
const { PUNCH_ALBUM_ID } = process.env;

module.exports = class PunchCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'punch',
			aliases: ['falcon-punch'],
			group: 'roleplay',
			memberName: 'punch',
			description: 'Punches a user.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: PUNCH_ALBUM_ID,
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
		return `_**${msg.author.username}** punches **${user.username}**._`;
	}
};
