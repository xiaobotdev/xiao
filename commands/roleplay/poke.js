const ImgurAlbumCommand = require('../../structures/commands/ImgurAlbum');
const { POKE_ALBUM_ID } = process.env;

module.exports = class PokeCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'poke',
			aliases: ['boop'],
			group: 'roleplay',
			memberName: 'poke',
			description: 'Pokes a user.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: POKE_ALBUM_ID,
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
		return `_**${msg.author.username}** pokes **${user.username}**._`;
	}
};
