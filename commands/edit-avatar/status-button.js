const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = class StatusButtonCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'status-button',
			aliases: ['c99-nl'],
			group: 'edit-avatar',
			memberName: 'status-button',
			description: 'Creates a Discord status button from c99.nl.',
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Discord Status Button',
					url: 'https://discord.c99.nl/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'user',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	run(msg, { user }) {
		if (user.bot) return msg.reply('You cannot get the status button of a bot.');
		return msg.say(stripIndents`
			_Getting "User not found"? Visit <https://discord.c99.nl/> for more information._
			https://discord.c99.nl/widget/theme-1/${user.id}.png
		`);
	}
};
