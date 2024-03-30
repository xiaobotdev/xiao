const Command = require('../../framework/Command');

module.exports = class DisableCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'disable',
			aliases: ['disable-command', 'disable-cmd'],
			group: 'util',
			memberName: 'disable',
			description: 'Disables a command.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			guarded: true,
			args: [
				{
					key: 'command',
					type: 'command'
				}
			]
		});
	}

	run(msg, { command }) {
		if (!command._enabled) return msg.say(`The \`${command.name}\` command is already disabled.`);
		if (command.guarded) return msg.say(`The \`${command.name}\` command cannot be disabled.`);
		command.disable();
		return msg.say(`Disabled the \`${command.name}\` command.`);
	}
};
