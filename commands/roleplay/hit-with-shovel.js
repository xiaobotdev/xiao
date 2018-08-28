const RoleplayCommand = require('../../structures/commands/Roleplay');
const { HIT_WITH_SHOVEL_ALBUM_ID } = process.env;

module.exports = class HitWithShovelCommand extends RoleplayCommand {
	constructor(client) {
		super(client, {
			name: 'hit-with-shovel',
			group: 'roleplay',
			memberName: 'hit-with-shovel',
			description: 'Hits a user with a shovel.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: HIT_WITH_SHOVEL_ALBUM_ID,
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
		return `_**${msg.author.username}** hits **${user.username}** with a shovel._`;
	}
};
