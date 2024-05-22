const Command = require('../../framework/Command');

module.exports = class DeleteReminderCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'delete-reminder',
			aliases: ['delete-remind', 'delete-timer', 'del-reminder', 'del-remind', 'del-timer'],
			group: 'remind',
			description: 'Deletes your reminder(s) set in this channel.'
		});
	}

	async run(msg) {
		const found = this.client.timers.findAll(msg.channel.id, msg.author.id);
		if (!found.size) return msg.reply('🕰️ You do not have a reminder set in this channel.');
		for (const timer of found.values()) {
			await timer.delete();
		}
		return msg.say('🕰️ Your reminder(s) set in this channel have been deleted.');
	}
};
