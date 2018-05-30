const Command = require('../../structures/Command');

module.exports = class AddOpenRoleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'add-open-role',
			aliases: ['set-open-role', 'open-role'],
			group: 'role-manage',
			memberName: 'add-open-role',
			description: 'Sets a role as open.',
			guildOnly: true,
			userPermissions: ['MANAGE_ROLES'],
			args: [
				{
					key: 'role',
					prompt: 'What role do you want to open?',
					type: 'role'
				}
			]
		});
	}

	run(msg, { role }) {
		if (role.id === msg.guild.defaultRole.id) return msg.reply('The everyone role is already open!');
		const roles = msg.guild.settings.get('openRoles', []);
		if (roles.includes(role.id)) return msg.reply(`${role.name} is already open!`);
		roles.push(role.id);
		msg.guild.settings.set('openRoles', roles);
		return msg.say(`${role.name} is now open!`);
	}
};
