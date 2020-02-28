const Command = require('../../structures/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const { util: { permissions } } = require('discord.js-commando');

module.exports = class RoleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'role',
			aliases: ['role-info'],
			group: 'info',
			memberName: 'role',
			description: 'Responds with detailed information on a role.',
			guildOnly: true,
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'role',
					prompt: 'Which role would you like to get information on?',
					type: 'role'
				}
			]
		});
	}

	run(msg, { role }) {
		const serialized = role.permissions.serialize();
		const perms = Object.keys(permissions).filter(perm => serialized[perm]);
		const embed = new MessageEmbed()
			.setColor(role.hexColor)
			.addField('❯ Name', role.name, true)
			.addField('❯ ID', role.id, true)
			.addField('❯ Color', role.hexColor.toUpperCase(), true)
			.addField('❯ Creation Date', moment.utc(role.createdAt).format('MM/DD/YYYY h:mm A'), true)
			.addField('❯ Hoisted?', role.hoist ? 'Yes' : 'No', true)
			.addField('❯ Mentionable?', role.mentionable ? 'Yes' : 'No', true)
			.addField('❯ Permissions', perms.map(perm => permissions[perm]).join(', ') || 'None');
		return msg.embed(embed);
	}
};
