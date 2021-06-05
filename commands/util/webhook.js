const Command = require('../../framework/Command');

module.exports = class WebhookCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'webhook',
			aliases: ['rin', 'rin-say'],
			group: 'util',
			memberName: 'webhook',
			description: 'Posts a message to the webhook defined in the bot owner\'s `process.env`.',
			details: 'Only the bot owner(s) may use this command.',
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

	async run(msg, { content }) {
		try {
			if (msg.guild && msg.deletable) await msg.delete();
			await this.client.webhook.send(content);
			return null;
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
