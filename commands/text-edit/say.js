const Command = require('../../structures/Command');

module.exports = class SayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'say',
			aliases: ['copy', 'echo'],
			group: 'text-edit',
			memberName: 'say',
			description: 'Make XiaoBot say what you wish.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like XiaoBot to say?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		const { text } = args;
		if (msg.channel.type === 'text' && msg.channel.permissionsFor(this.client.user).has('MANAGE_MESSAGES')) {
			await msg.delete();
		}
		return msg.say(text);
	}
};
