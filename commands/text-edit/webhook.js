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
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			clientPermissions: ['MANAGE_MESSAGES'],
			args: [
				{
					key: 'message',
					prompt: 'What text would you like the webhook to say?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { message }) {
		if (msg.channel.type === 'text') await msg.delete();
		try {
			await snekfetch.post(WEBHOOK_URL).send({ content: message });
			return null;
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
