const ImgurAlbumCommand = require('../../structures/commands/ImgurAlbum');
const { BRO_HOOF_ALBUM_ID } = process.env;

module.exports = class BroHoofCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'bro-hoof',
			group: 'roleplay',
			memberName: 'bro-hoof',
			description: 'Gives a user a bro hoof.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: BRO_HOOF_ALBUM_ID,
			credit: [
				{
					name: 'Hasbro',
					url: 'https://shop.hasbro.com/en-us',
					reason: 'Original "My Little Pony: Friendship is Magic" Show',
					reasonURL: 'https://mylittlepony.hasbro.com/en-us'
				}
			],
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
		return `_**${msg.author.username}** gives **${user.username}** a bro hoof._`;
	}
};
