const Command = require('../../structures/Command');
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
					prompt: 'Do you want to add, subtract, or set exact?',
					type: 'string',
					oneOf: modes,
					parse: mode => mode.toLowerCase()
				},
				{
					key: 'command',
					prompt: 'What command do you want to modify?',
					type: 'command'
				},
				{
					key: 'num',
					label: 'number',
					prompt: 'How much do you want to change the usage?',
					type: 'integer',
					min: 1
				}
			]
		});
	}

	async run(msg, { mode, command, num }) {
		switch (mode) {
			case 'add': command.uses += num; break;
			case 'subtract': command.uses -= num; break;
			case 'exact': command.uses = num; break;
		}
		this.client.exportCommandLeaderboard();
		return msg.say(`${modeDesc[mode]} **${num}** ${conj[mode]} the uses of the \`${command.name}\` command.`);
	}
};
