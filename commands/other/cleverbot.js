const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { CLEVERBOT_KEY } = process.env;

module.exports = class CleverbotCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cleverbot',
			aliases: ['clevs'],
			group: 'other',
			memberName: 'cleverbot',
			description: 'Chat with Cleverbot.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			args: [
				{
					key: 'message',
					prompt: 'What do you want to say to Cleverbot?',
					type: 'string'
				}
			]
		});

		this.convos = new Map();
	}

	async run(msg, { message }) {
		try {
			const { body } = await request
				.get('https://www.cleverbot.com/getreply')
				.query({
					key: CLEVERBOT_KEY,
					cs: this.convos.get(msg.channel.id),
					input: message
				});
			this.convos.set(msg.channel.id, body.cs);
			return msg.reply(body.output);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
