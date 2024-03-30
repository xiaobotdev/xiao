const Command = require('../../framework/Command');
const modes = ['add', 'subtract', 'exact'];
const modeDesc = {
	add: 'Added',
	subtract: 'Subtracted',
	exact: 'Set'
};
const conj = {
	add: 'to',
	subtract: 'from',
	exact: 'as'
};

module.exports = class SetUsesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'set-uses',
			group: 'util',
			memberName: 'set-uses',
			description: 'Changes command usage stats.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			guarded: true,
			args: [
				{
					key: 'mode',
					type: 'string',
					oneOf: modes,
					parse: mode => mode.toLowerCase()
				},
				{
					key: 'command',
					type: 'command'
				},
				{
					key: 'num',
					label: 'number',
					type: 'integer',
					min: 1
				}
			]
		});
	}

	run(msg, { mode, command, num }) {
		switch (mode) {
			case 'add': command.uses += num; break;
			case 'subtract': command.uses -= num; break;
			case 'exact': command.uses = num; break;
		}
		this.client.exportCommandLeaderboard();
		return msg.say(`${modeDesc[mode]} **${num}** ${conj[mode]} the uses of the \`${command.name}\` command.`);
	}
};
