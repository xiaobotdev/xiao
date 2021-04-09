const Command = require('../../structures/Command');

module.exports = class DeleteReminderCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'delete-reminder',
			aliases: ['delete-remind', 'delete-timer', 'del-reminder', 'del-remind', 'del-timer'],
			group: 'remind',
			memberName: 'delete-reminder',
			description: 'Deletes your reminder.'
		});
	}

	async run(msg) {
		const exists = await this.client.timers.exists(msg.channel.id, msg.author.id);
		if (!exists) return msg.reply('🕰️ You do not have a reminder set in this channel.');
		await this.client.timers.deleteTimer(msg.channel.id, msg.author.id);
		return msg.say('🕰️ Your reminder has been deleted.');
	}
};
