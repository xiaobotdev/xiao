const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { GOOGLE_KEY } = process.env;

module.exports = class ToxicityCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'toxicity',
			aliases: ['perspective', 'comment-toxicity'],
			group: 'analyze',
			memberName: 'toxicity',
			description: 'Determines the toxicity of text.',
			credit: [
				{
					name: 'Perspective API',
					url: 'https://www.perspectiveapi.com/#/'
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
					requestedAttributes: { TOXICITY: {} }
				});
			const toxicity = Math.round(body.attributeScores.TOXICITY.summaryScore.value * 100);
			if (toxicity >= 70) return msg.reply(`Likely to be perceived as toxic. (${toxicity}%)`);
			if (toxicity >= 40) return msg.reply(`Unsure if this will be perceived as toxic. (${toxicity}%)`);
			return msg.reply(`Unlikely to be perceived as toxic. (${toxicity}%)`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
