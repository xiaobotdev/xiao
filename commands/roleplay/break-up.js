const RoleplayCommand = require('../../structures/commands/Roleplay');
const { BREAK_UP_ALBUM_ID } = process.env;

module.exports = class BreakUpCommand extends RoleplayCommand {
	constructor(client) {
		super(client, {
			name: 'break-up',
			aliases: ['divorce'],
			group: 'roleplay',
			memberName: 'break-up',
			description: 'Breaks up with a user.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: BREAK_UP_ALBUM_ID,
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
		return `_**${msg.author.username}** breaks up with **${user.username}**._`;
	}
};
