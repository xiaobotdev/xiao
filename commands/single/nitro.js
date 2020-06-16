const Command = require('../../structures/Command');
const path = require('path');

module.exports = class NitroCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'nitro',
			aliases: ['fake-nitro'],
			group: 'single',
			memberName: 'nitro',
			description: 'Sends an image of a fake nitro giveaway.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'u/MoonlightCapital',
					url: 'https://www.reddit.com/user/MoonlightCapital/',
					reason: 'Image',
					reasonURL: 'https://www.reddit.com/r/discordapp/comments/a9fr7x/troll_your_friends_with_this/'
				}
			]
		});
	}

	run(msg) {
		return msg.say({ files: [path.join(__dirname, '..', '..', 'assets', 'images', 'nitro.png')] });
	}
};
