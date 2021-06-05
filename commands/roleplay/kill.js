const ImgurAlbumCommand = require('../../structures/Commands/ImgurAlbum');
const { KILL_ALBUM_ID } = process.env;

module.exports = class KillCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'kill',
			aliases: ['murder'],
			group: 'roleplay',
			memberName: 'kill',
			description: 'Kills a user.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: KILL_ALBUM_ID,
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
		return `_**${msg.author.username}** kills **${user.username}**._`;
	}
};
