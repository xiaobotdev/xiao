const ImgurAlbumCommand = require('../../structures/Commands/ImgurAlbum');
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
		const noUserAuthor = msg.author.id !== user.id;
		return `_**${msg.author.username}** falls asleep${noUserAuthor ? ` with **${user.username}**` : ''}._`;
	}
};
