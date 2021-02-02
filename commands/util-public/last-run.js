const Command = require('../../structures/Command');
const moment = require('moment');

module.exports = class LastRunCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'last-run',
			aliases: ['command-last-run', 'cmd-last-run', 'cmd-run', 'command-run'],
			group: 'util-public',
			memberName: 'last-run',
			description: 'Responds with a command\'s most recent run date.',
			guarded: true,
			args: [
				{
					key: 'command',
					prompt: 'Which command would you like to view the last run date of?',
					type: 'command'
				}
			]
		});
	}

	run(msg, { command }) {
		if (command.lastRun === undefined) return msg.reply('That command\'s usage stats aren\'t being tracked.');
		if (!command.lastRun) return msg.reply(`The \`${command.name}\` command has not been run since last reboot.`);
		const displayTime = moment.utc(command.lastRun).format('MM/DD/YYYY h:mm A');
		return msg.say(`The \`${command.name}\` command was last run on **${displayTime}**.`);
	}
};
