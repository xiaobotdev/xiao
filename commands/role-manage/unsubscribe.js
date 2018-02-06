const { Command } = require('discord.js-commando');
const { HOME_GUILD_ID, HOME_GUILD_ROLES } = process.env;
const roles = HOME_GUILD_ROLES.split(',');

module.exports = class UnsubscribeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'unsubscribe',
			aliases: ['leave'],
			group: 'role-manage',
			memberName: 'unsubscribe',
			description: 'Unsubscribes you from the specified role.',
			details: 'This command only works in the home server.',
			guildOnly: true,
			clientPermissions: ['MANAGE_ROLES'],
			args: [
				{
					key: 'role',
					prompt: 'What role do you want to unsubscribe from?',
					type: 'role'
				}
			]
		});
	}

	async run(msg, { role }) {
		if (msg.guild.id !== HOME_GUILD_ID) return msg.reply('This command only works in the home server.');
		if (!roles.includes(role.id)) return msg.reply('This role is not open!');
		if (!role.editable) return msg.reply('I do not have permission to manage this role!');
		if (!msg.member.roles.has(role.id)) return msg.reply('You are not a member of this role!');
		await msg.member.roles.remove(role);
		return msg.say(`You were removed from **${role.name}**...`);
	}
};
