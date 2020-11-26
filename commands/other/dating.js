const ImgurAlbumCommand = require('../../structures/commands/ImgurAlbum');
const { stripIndents } = require('common-tags');
const texts = require('../../assets/json/dating');
const { DATING_ALBUM_ID } = process.env;

module.exports = class DatingCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'dating',
			aliases: ['date', 'tinder'],
			group: 'other',
			memberName: 'dating',
			description: 'Find the person of your dreams with this dating system!',
			clientPermissions: ['ATTACH_FILES'],
			albumID: DATING_ALBUM_ID
		});
	}

	generateText() {
		const text = texts[Math.floor(Math.random() * texts.length)];
		return stripIndents`
			**${this.client.user.username}, ${new Date().getFullYear() - 2017}**
			_${text}_

			Send a friend request to ${this.client.user.tag} to meet now!
			Don't worry, this is just a joke. Unless...
		`;
	}
};
