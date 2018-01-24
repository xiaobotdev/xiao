const { Command } = require('discord.js-commando');
const { HOME_GUILD_ID, HOME_GUILD_ROLES } = process.env;

module.exports = class SubscribeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'subscribe',
			aliases: ['join'],
			group: 'role-manage',
			memberName: 'subscribe',
			description: 'Subscribes you to the specified role.',
			details: 'This command only works in the home server.',
			guildOnly: true,
			clientPermissions: ['MANAGE_ROLES'],
			args: [
				{
					key: 'role',
					prompt: 'What role do you want to subscribe to?',
					type: 'role'
				}
			]
		});
	}

	async run(msg, { role }) {
		if (msg.guild.id !== HOME_GUILD_ID) return msg.reply('This command only works in the home server.');
		if (!HOME_GUILD_ROLES.split(',').includes(role.id)) return msg.reply('This role is not open!');
		if (!role.editable) return msg.reply('I do not have permission to manage this role!');
		if (msg.member.roles.has(role.id)) return msg.reply('You are already a member of this role!');
		await msg.member.roles.add(role);
		return msg.say(`You were added to **${role.name}**!`);
	}
};
