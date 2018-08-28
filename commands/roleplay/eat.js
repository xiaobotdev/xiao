const RoleplayCommand = require('../../structures/commands/Roleplay');
const { EAT_ALBUM_ID } = process.env;

module.exports = class EatCommand extends RoleplayCommand {
	constructor(client) {
		super(client, {
			name: 'eat',
			group: 'roleplay',
			memberName: 'eat',
			description: 'Eats a user.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: EAT_ALBUM_ID,
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
		return `_**${msg.author.username}** eats **${user.username}**._`;
	}
};
