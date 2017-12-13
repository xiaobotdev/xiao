const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { WEBHOOK_ID, WEBHOOK_TOKEN } = process.env;

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
					key: 'content',
					prompt: 'What text would you like the webhook to say?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { content }) {
		if (msg.channel.type === 'text') await msg.delete();
		try {
			await snekfetch.post(`https://discordapp.com/api/webhooks/${WEBHOOK_ID}/${WEBHOOK_TOKEN}`).send({ content });
			return null;
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
