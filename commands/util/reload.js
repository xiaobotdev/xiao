const Command = require('../../structures/Command');

module.exports = class ReloadCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reload',
			aliases: ['reload-command', 'reload-cmd'],
			group: 'util',
			memberName: 'reload',
			description: 'Reloads a command or command group.',
			details: 'Only the bot owner(s) may use this command.',
			guarded: true,
			ownerOnly: true,
			args: [
				{
					key: 'cmdOrGrp',
					label: 'command/group',
					prompt: 'Which command or group would you like to reload?',
					type: 'command|group'
				}
			]
		});
	}

	run(msg, { cmdOrGrp }) {
		const isCmd = Boolean(cmdOrGrp.groupID);
		cmdOrGrp.reload();
		if (isCmd) return msg.say(`Reloaded the \`${cmdOrGrp.name}\` command.`);
		return msg.say(`Reloaded all of the commands in the \`${cmdOrGrp.name}\` group.`);
	}
};
