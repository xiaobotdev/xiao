const RoleplayCommand = require('../../structures/commands/Roleplay');
const { FALCON_PUNCH_ALBUM_ID } = process.env;

module.exports = class FalconPunchCommand extends RoleplayCommand {
	constructor(client) {
		super(client, {
			name: 'falcon-punch',
			group: 'roleplay',
			memberName: 'falcon-punch',
			description: 'Falcon Punches a user.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: FALCON_PUNCH_ALBUM_ID,
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
		return `_**${msg.author.username}** falcon punches **${user.username}**._`;
	}
};
