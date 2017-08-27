const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');
const { WEBHOOK_URL } = process.env;

module.exports = class WebhookCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'webhook',
			aliases: ['rin', 'rin-say'],
			group: 'text-edit',
			memberName: 'webhook',
			description: 'Posts a message to the webhook defined in your `process.env`.',
			ownerOnly: true,
			args: [
				{
					key: 'content',
					prompt: 'What text would you like the webhook to say?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		const { content } = args;
		if (msg.guild && msg.channel.permissionsFor(this.client.user).has('MANAGE_MESSAGES')) await msg.delete();
		try {
			await snekfetch
				.post(WEBHOOK_URL)
				.send({ content });
			return null;
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
