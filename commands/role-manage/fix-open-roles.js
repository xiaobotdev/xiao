const Command = require('../../structures/Command');

module.exports = class FixOpenRolesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fix-open-roles',
			aliases: ['fix-roles'],
			group: 'role-manage',
			memberName: 'fix-open-roles',
			description: 'Removes no longer existent roles from the open roles lists.',
			ownerOnly: true
		});
	}

	run(msg) {
		let count = 0;
		for (const guild of this.client.guilds.values()) {
			const roles = guild.settings.get('openRoles', []);
			if (!roles.length) continue;
			for (const role of roles) {
				if (guild.roles.has(role)) continue;
				roles.splice(roles.indexOf(role), 1);
				count++;
			}
			if (!roles.length) guild.settings.remove('openRoles');
			else guild.settings.set('openRoles', roles);
		}
		return msg.say(`Cleared **${count}** roles from the open roles lists.`);
	}
};
