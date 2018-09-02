const RoleplayCommand = require('../../structures/commands/Roleplay');
const { WAVE_ALBUM_ID } = process.env;

module.exports = class WaveCommand extends RoleplayCommand {
	constructor(client) {
		super(client, {
			name: 'wave',
			group: 'roleplay',
			memberName: 'wave',
			description: 'Waves at a user.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: WAVE_ALBUM_ID,
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
		return `_**${msg.author.username}** waves at **${user.username}**._`;
	}
};
