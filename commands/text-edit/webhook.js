const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');
const { webhookURL } = require('../../config');

module.exports = class WebhookCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'webhook',
			aliases: ['rin', 'rin-say'],
			group: 'text-edit',
			memberName: 'webhook',
			description: 'Posts a message to the webhook defined in your `config.json`.',
			guildOnly: true,
			ownerOnly: true,
			clientPermissions: ['MANAGE_MESSAGES'],
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
		msg.delete();
		await snekfetch
			.post(webhookURL)
			.send({ content });
		return null;
	}
};
