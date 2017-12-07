const { Command } = require('discord.js-commando');
const roles = require('../../assets/json/roles');

module.exports = class SubscribeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'subscribe',
			aliases: ['join'],
			group: 'role-manage',
			memberName: 'subscribe',
			description: 'Subscribes you to the specified role.',
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
		if (!roles[msg.guild.id]) return msg.say('This server has no roles open...');
		if (!roles[msg.guild.id].includes(role.id)) return msg.reply('This role is not open!');
		if (!role.editable) return msg.reply('I do not have permission to manage this role!');
		if (msg.member.roles.has(role.id)) return msg.reply('You are already a member of this role!');
		await msg.member.addRole(role);
		return msg.say(`You were added to **${role.name}**!`);
	}
};
