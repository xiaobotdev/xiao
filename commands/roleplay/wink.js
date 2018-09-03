const RoleplayCommand = require('../../structures/commands/Roleplay');
const { WINK_ALBUM_ID } = process.env;

module.exports = class WinkCommand extends RoleplayCommand {
	constructor(client) {
		super(client, {
			name: 'wink',
			group: 'roleplay',
			memberName: 'wink',
			description: 'Winks at a user.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: WINK_ALBUM_ID,
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
		return `_**${msg.author.username}** winks at **${user.username}**._`;
	}
};
