const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { CLEVERBOT_KEY, CLEVERBOT_PATTERN_USERS } = process.env;
const allowedPatternUsers = CLEVERBOT_PATTERN_USERS ? CLEVERBOT_PATTERN_USERS.split(',') : [];
const blankResponses = ['What?', 'Huh?', 'I don\'t understand.', 'Speak up, please.'];

module.exports = class CleverbotCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cleverbot',
			aliases: ['clevs', 'chat'],
			group: 'other',
			memberName: 'cleverbot',
			description: 'Talk to Cleverbot.',
			credit: [
				{
					name: 'Cleverbot API',
					url: 'https://www.cleverbot.com/api/'
				}
			],
			args: [
				{
					key: 'text',
					prompt: 'What do you want to say to Cleverbot?',
					type: 'string'
				}
			],
			patterns: []
		});

		this.convos = new Map();
		this.patterns.push(new RegExp(`^(<!?@${this.client.user.id}>) (.+)`, 'i'));
	}

	async run(msg, { text }, fromPattern) {
		if (fromPattern) {
			if (!allowedPatternUsers.includes(msg.author.id)) return null;
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
