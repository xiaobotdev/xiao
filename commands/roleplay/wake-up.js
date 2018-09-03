const ImgurAlbumCommand = require('../../structures/commands/ImgurAlbum');
const { WAKE_UP_ALBUM_ID } = process.env;

module.exports = class WakeUpCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'wake-up',
			aliases: ['awaken', 'awake'],
			group: 'roleplay',
			memberName: 'wake-up',
			description: 'Wakes up a user.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: WAKE_UP_ALBUM_ID,
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
		return `_**${user.username}** wakes up._`;
	}
};
