const Command = require('../../framework/Command');
const moment = require('moment');

module.exports = class LastRunCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'last-run',
			aliases: ['command-last-run', 'cmd-last-run', 'cmd-run', 'command-run'],
			group: 'util-public',
			description: 'Responds with a command\'s most recent run date.',
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
		if (command.unknown || command.lastRun === undefined) {
			return msg.reply('That command\'s usage stats aren\'t being tracked.');
		}
		if (command.ownerOnly && !this.client.isOwner(msg.author)) {
			return msg.reply(`The \`${command.name}\` command can only be used by the bot owner(s).`);
		}
		if (!command.lastRun) return msg.reply(`The \`${command.name}\` command has never been run.`);
		const displayTime = moment.utc(command.lastRun).format('MM/DD/YYYY h:mm A');
		return msg.say(`The \`${command.name}\` command was last run on **${displayTime}**.`);
	}
};
