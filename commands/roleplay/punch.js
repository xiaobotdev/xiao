const RoleplayCommand = require('../../structures/commands/Roleplay');
const { PUNCH_ALBUM_ID } = process.env;

module.exports = class PunchCommand extends RoleplayCommand {
	constructor(client) {
		super(client, {
			name: 'punch',
			group: 'roleplay',
			memberName: 'punch',
			description: 'Punches a user.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: PUNCH_ALBUM_ID,
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
		return `_**${msg.author.username}** punches **${user.username}**._`;
	}
};
