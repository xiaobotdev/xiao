const Command = require('../../structures/Command');
const request = require('node-superfetch');
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
		try {
			if (msg.channel.type === 'text' && msg.deletable) await msg.delete();
			await request
				.post(`https://discordapp.com/api/webhooks/${WEBHOOK_ID}/${WEBHOOK_TOKEN}`)
				.send({ content });
			return null;
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
