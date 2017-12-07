const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const roles = require('../../assets/json/roles');

module.exports = class RolelistCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'role-list',
			aliases: ['roles'],
			group: 'role-manage',
			memberName: 'role-list',
			description: 'Responds with all available roles in this server.',
			guildOnly: true
		});
	}

	run(msg) {
		if (!roles[msg.guild.id]) return msg.say('This server has no roles open...');
		return msg.say(stripIndents`
			**Roles available in ${msg.guild.name}**:
			${msg.guild.roles.filter(role => roles[msg.guild.id].includes(role.id)).map(role => role.name).join('\n')}
		`);
	}
};
