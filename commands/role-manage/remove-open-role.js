const Command = require('../../structures/Command');

module.exports = class RemoveOpenRoleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'remove-open-role',
			aliases: ['delete-open-role', 'close-role'],
			group: 'role-manage',
			memberName: 'remove-open-role',
			description: 'Remove a role from the open roles.',
			guildOnly: true,
			userPermissions: ['MANAGE_ROLES'],
			args: [
				{
					key: 'role',
					prompt: 'What role do you want to close?',
					type: 'role'
				}
			]
		});
	}

	run(msg, { role }) {
		if (role.id === msg.guild.defaultRole.id) return msg.reply('The everyone role cannot be closed!');
		const roles = msg.guild.settings.get('openRoles', []);
		if (!roles.includes(role.id)) return msg.reply(`${role.name} is not open!`);
		roles.splice(roles.indexOf(role.id), 1);
		if (!roles.length) msg.guild.settings.remove('openRoles');
		else msg.guild.settings.set('openRoles', roles);
		return msg.say(`${role.name} is now closed...`);
	}
};
