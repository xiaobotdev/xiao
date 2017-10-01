const { Command } = require('discord.js-commando');

module.exports = class SayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'say',
			aliases: ['copy', 'echo'],
			group: 'text-edit',
			memberName: 'say',
			description: 'Make XiaoBot say what you wish.',
			guildOnly: true,
			clientPermissions: ['MANAGE_MESSAGES', 'READ_MESSAGE_HISTORY'],
			args: [
				{
					key: 'text',
					prompt: 'What text would you like XiaoBot to say?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { text }) {
		await msg.delete();
		return msg.say(text);
	}
};
