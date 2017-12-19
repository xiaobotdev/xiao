const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const { HOME_GUILD_ID, HOME_GUILD_ROLES } = process.env;

module.exports = class RoleListCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'role-list',
			aliases: ['roles'],
			group: 'role-manage',
			memberName: 'role-list',
			description: 'Responds with all available roles to join in the home server.',
			details: 'This command only works in the home server.',
			guildOnly: true
		});
	}

	run(msg) {
		if (msg.guild.id !== HOME_GUILD_ID) return msg.reply('This command only works in the home server.');
		return msg.say(stripIndents`
			**Roles available in ${msg.guild.name}**:
			${msg.guild.roles.filter(role => HOME_GUILD_ROLES.split(',').includes(role.id)).map(role => role.name).join('\n')}
		`);
	}
};
