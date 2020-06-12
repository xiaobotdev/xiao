const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { CLEVERBOT_KEY } = process.env;
const blankResponses = ['What?', 'Huh?', 'I don\'t understand.', 'Speak up, please.'];

module.exports = class CleverbotCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cleverbot',
			aliases: ['clevs', 'chat'],
			group: 'other',
			memberName: 'cleverbot',
			description: 'Talk to Cleverbot.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			credit: [
				{
					name: 'Cleverbot',
					url: 'https://www.cleverbot.com/',
					reason: 'API',
					reasonURL: 'https://www.cleverbot.com/api/'
				}
			],
			args: [
				{
					key: 'text',
					prompt: 'What do you want to say to Cleverbot?',
					type: 'string'
				}
			],
			patterns: [/^(clevs|cleverbot) (.+)/i]
		});

		this.convos = new Map();
	}

	async run(msg, { text }, fromPattern) {
		if (fromPattern) {
			if (msg.guild && !msg.channel.permissionsFor(this.client.user).has('SEND_MESSAGES')) return null;
			text = msg.patternMatches[2];
		}
		try {
			const convo = this.convos.get(msg.channel.id);
			const { body } = await request
				.get('https://www.cleverbot.com/getreply')
				.query({
					key: CLEVERBOT_KEY,
					cs: convo ? convo.cs : '',
					input: text
				});
			if (convo) clearTimeout(convo.timeout);
			const timeout = setTimeout(() => this.convos.delete(msg.channel.id), 600000);
			this.convos.set(msg.channel.id, { cs: body.cs, timeout });
			return msg.reply(body.output || blankResponses[Math.floor(Math.random() * blankResponses.length)]);
		} catch (err) {
			if (fromPattern) return null;
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
