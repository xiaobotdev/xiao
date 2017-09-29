const { Command } = require('discord.js-commando');
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
			args: [
				{
					key: 'content',
					prompt: 'What text would you like the webhook to say?',
					type: 'string'
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author) || `The \`${this.name}\` command can only be used by the bot owner.`;
	}

	async run(msg, { content }) {
		if (msg.channel.type === 'text' && msg.channel.permissionsFor(this.client.user).has('MANAGE_MESSAGES')) {
			await msg.delete();
		}
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
