const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class StatusButtonCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'status-button',
			aliases: ['c99-nl'],
			group: 'avatar-edit',
			memberName: 'status-button',
			description: 'Creates a Discord status button from c99.nl.',
			clientPermissions: ['ATTACH_FILES'],
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
					prompt: 'Which user would you like to get the status button of?',
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
