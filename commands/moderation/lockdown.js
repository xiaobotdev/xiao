const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class LockdownCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lockdown',
			group: 'moderation',
			memberName: 'lockdown',
			description: 'Prevents users from posting in the current channel, or removes a lockdown.',
			guildOnly: true,
			clientPermissions: ['ADMINISTRATOR'],
			userPermissions: ['ADMINISTRATOR'],
			args: [
				{
					key: 'type',
					prompt: 'Please enter either start or stop.',
					type: 'string',
					default: 'start',
					validate: type => {
						if (['start', 'stop'].includes(type.toLowerCase())) return true;
						return 'Please enter either start or stop.';
					},
					parse: type => type.toLowerCase()
				}
			]
		});
	}

	async run(msg, args) { // eslint-disable-line consistent-return
		const { type } = args;
		if (type === 'start') {
			await msg.channel.overwritePermissions(msg.guild.defaultRole, { SEND_MESSAGES: false });
			return msg.say(stripIndents`
				Lockdown Started, users without Administrator can no longer post messages.
				Please use \`lockdown stop\` to end the lockdown.
			`);
		} else if (type === 'stop') {
			await msg.channel.overwritePermissions(msg.guild.defaultRole, { SEND_MESSAGES: null });
			return msg.say('Lockdown Ended.');
		}
	}
};
