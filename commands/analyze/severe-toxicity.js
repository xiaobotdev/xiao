const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { GOOGLE_KEY } = process.env;

module.exports = class SevereToxicityCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'severe-toxicity',
			aliases: ['severe-perspective', 'severe-comment-toxicity'],
			group: 'analyze',
			memberName: 'severe-toxicity',
			description: 'Determines the toxicity of text, but less sensitive to milder language.',
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
					type: 'string'
				}
			]
		});
	}

	async run(msg, { text }) {
		try {
			const { body } = await request
				.post('https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze')
				.query({ key: GOOGLE_KEY })
				.send({
					comment: { text },
					languages: ['en'],
					requestedAttributes: { SEVERE_TOXICITY: {} }
				});
			const toxicity = Math.round(body.attributeScores.SEVERE_TOXICITY.summaryScore.value * 100);
			if (toxicity >= 70) return msg.reply(`Likely to be perceived as toxic. (${toxicity}%)`);
			if (toxicity >= 40) return msg.reply(`Unsure if this will be perceived as toxic. (${toxicity}%)`);
			return msg.reply(`Unlikely to be perceived as toxic. (${toxicity}%)`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
