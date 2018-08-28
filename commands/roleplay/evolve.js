const RoleplayCommand = require('../../structures/commands/Roleplay');
const { EVOLVE_ALBUM_ID } = process.env;

module.exports = class EvolveCommand extends RoleplayCommand {
	constructor(client) {
		super(client, {
			name: 'evolve',
			group: 'roleplay',
			memberName: 'evolve',
			description: 'Evolves a user.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: EVOLVE_ALBUM_ID,
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
		return `_**${user.username}** is evolving!_`;
	}
};
