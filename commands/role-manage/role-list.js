const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class RoleListCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'role-list',
			aliases: ['roles', 'open-roles'],
			group: 'role-manage',
			memberName: 'role-list',
			description: 'Responds with all available roles to join.',
			guildOnly: true
		});
	}

	run(msg) {
		const roles = msg.guild.settings.get('openRoles', []);
		if (!roles.length) return msg.say('This server has no open roles...');
		return msg.say(stripIndents`
			**Roles available in ${msg.guild.name}**:
			${msg.guild.roles.filter(role => roles.includes(role.id)).map(role => role.name).join('\n')}
		`);
	}
};
