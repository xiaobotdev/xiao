const RoleplayCommand = require('../../structures/commands/Roleplay');
const { CUDDLE_ALBUM_ID } = process.env;

module.exports = class CuddleCommand extends RoleplayCommand {
	constructor(client) {
		super(client, {
			name: 'cuddle',
			group: 'roleplay',
			memberName: 'cuddle',
			description: 'Cuddles a user.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: CUDDLE_ALBUM_ID,
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
		return `_**${msg.author.username}** cuddles with **${user.username}**._`;
	}
};
