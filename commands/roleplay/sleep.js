const ImgurAlbumCommand = require('../../structures/commands/ImgurAlbum');
const { SLEEP_ALBUM_ID } = process.env;

module.exports = class SleepCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'sleep',
			aliases: ['fall-asleep'],
			group: 'roleplay',
			memberName: 'sleep',
			description: 'Puts a user to sleep.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: SLEEP_ALBUM_ID,
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
		return `_**${user.username}** falls asleep._`;
	}
};
