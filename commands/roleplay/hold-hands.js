const ImgurAlbumCommand = require('../../structures/commands/ImgurAlbum');
const { HOLD_HANDS_ALBUM_ID } = process.env;

module.exports = class HoldHandsCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'hold-hands',
			aliases: ['hold-hand'],
			group: 'roleplay',
			memberName: 'hold-hands',
			description: 'Holds hands with a user.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: HOLD_HANDS_ALBUM_ID,
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
		return `_**${msg.author.username}** holds **${user.username}**'s hand._`;
	}
};
