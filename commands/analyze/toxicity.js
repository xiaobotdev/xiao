const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { Message } = require('discord.js');
const { GOOGLE_KEY } = process.env;

module.exports = class ToxicityCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'toxicity',
			aliases: ['perspective', 'comment-toxicity', 'toxic'],
			group: 'analyze',
			memberName: 'toxicity',
			description: 'Determines the toxicity of text.',
			flags: [
				{
					key: 'severe',
					description: 'Makes the check much less vulnerable to basic swearing.'
				}
			],
			credit: [
				{
					name: 'Perspective API',
					url: 'https://www.perspectiveapi.com/#/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'text',
					prompt: 'What text do you want to test the toxicity of?',
					type: 'message|string'
				}
			]
		});
	}

	async run(msg, { text, flags: { severe } }) {
		if (text instanceof Message) text = text.content;
		try {
			const { body } = await request
				.post('https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze')
				.query({ key: GOOGLE_KEY })
				.send({
					comment: { text },
					languages: ['en'],
					requestedAttributes: severe ? { SEVERE_TOXICITY: {} } : { TOXICITY: {} }
				});
			const score = severe ? body.body.attributeScores.SEVERE_TOXICITY : body.attributeScores.TOXICITY;
			const toxicity = Math.round(score.summaryScore.value * 100);
			if (toxicity >= 70) return msg.reply(`Likely to be perceived as toxic. (${toxicity}%)`);
			if (toxicity >= 40) return msg.reply(`Unsure if this will be perceived as toxic. (${toxicity}%)`);
			return msg.reply(`Unlikely to be perceived as toxic. (${toxicity}%)`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
