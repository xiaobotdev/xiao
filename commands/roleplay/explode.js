const ImgurAlbumCommand = require('../../structures/commands/ImgurAlbum');
const { EXPLODE_ALBUM_ID } = process.env;

module.exports = class ExplodeCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'explode',
			aliases: ['explosion', 'megumin', 'boom', 'boom-boom', 'nuke', 'xplode', 'plode'],
			group: 'roleplay',
			memberName: 'explode',
			description: 'Explodes a user.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: EXPLODE_ALBUM_ID,
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
		return `_**${msg.author.username}** ${noUserAuthor ? `explodes **${user.username}**` : 'casts explosion'}._`;
	}
};
