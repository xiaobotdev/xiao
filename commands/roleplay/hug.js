const RoleplayCommand = require('../../structures/commands/Roleplay');
const { HUG_ALBUM_ID } = process.env;

module.exports = class HugCommand extends RoleplayCommand {
	constructor(client) {
		super(client, {
			name: 'hug',
			aliases: ['cuddle', 'glomp', 'tackle', 'tackle-hug'],
			group: 'roleplay',
			memberName: 'hug',
			description: 'Hugs a user.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: HUG_ALBUM_ID,
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
		return `_**${msg.author.username}** hugs **${user.username}**._`;
	}
};
