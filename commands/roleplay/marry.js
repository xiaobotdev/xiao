const RoleplayCommand = require('../../structures/commands/Roleplay');
const { MARRY_ALBUM_ID } = process.env;

module.exports = class MarryCommand extends RoleplayCommand {
	constructor(client) {
		super(client, {
			name: 'marry',
			group: 'roleplay',
			memberName: 'marry',
			description: 'Marries a user.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: MARRY_ALBUM_ID,
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
		return `_**${msg.author.username}** marries **${user.username}**._`;
	}
};
