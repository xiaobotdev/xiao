const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { wait } = require('../../structures/Util');

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
					key: 'action',
					prompt: 'What action should be performed? Either start or stop.',
					type: 'string',
					default: 'start',
					validate: action => {
						if (['start', 'stop'].includes(action.toLowerCase())) return true;
						return 'Invalid action, please enter either start or stop.';
					},
					parse: action => action.toLowerCase()
				},
				{
					key: 'time',
					prompt: 'How long should the channel be locked down (in minutes)?',
					type: 'integer',
					default: '',
					validate: time => {
						if (time > 0 && time < 11) return true;
						return 'Please keep the time under 10 minutes.';
					},
					parse: time => time * 60000
				}
			]
		});
	}

	async run(msg, args) { // eslint-disable-line consistent-return
		const { action, time } = args;
		if (action === 'start') {
			await msg.channel.overwritePermissions(msg.guild.defaultRole, { SEND_MESSAGES: false });
			await msg.say(stripIndents`
				Lockdown started, users without overwrites can no longer post messages.
				${time ? 'Please use `lockdown stop` to end the lockdown.' : `Please wait ${time / 60000} minutes.`}
			`);
			if (!time) return null;
			await wait(time);
			await msg.channel.overwritePermissions(msg.guild.defaultRole, { SEND_MESSAGES: null });
			return msg.say('Lockdown ended, all users can now post messages.');
		}
		if (action === 'stop') {
			await msg.channel.overwritePermissions(msg.guild.defaultRole, { SEND_MESSAGES: null });
			return msg.say('Lockdown ended, all users can now post messages.');
		}
	}
};
