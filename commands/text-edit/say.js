const Command = require('../../structures/Command');

module.exports = class SayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'say',
			aliases: ['copy', 'echo'],
			group: 'text-edit',
			memberName: 'say',
			description: 'Make XiaoBot say what you wish.',
			guildOnly: true,
			args: [
				{
					key: 'text',
					prompt: 'What text would you like XiaoBot to say?',
					type: 'string'
				}
			]
		});
	}

	run(msg, args) {
		const { text } = args;
		if (msg.channel.permissionsFor(this.client.user).has('MANAGE_MESSAGES')) msg.delete();
		return msg.say(text);
	}
};
