const RoleplayCommand = require('../../structures/commands/Roleplay');
const { TACKLE_ALBUM_ID } = process.env;

module.exports = class TackleCommand extends RoleplayCommand {
	constructor(client) {
		super(client, {
			name: 'tackle',
			aliases: ['glomp', 'tackle-hug'],
			group: 'roleplay',
			memberName: 'tackle',
			description: 'Tackles a user.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: TACKLE_ALBUM_ID,
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
		return `_**${msg.author.username}** tackles **${user.username}**._`;
	}
};
