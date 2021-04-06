const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const { isImageNSFW } = require('../../util/Util');
const displayNames = {
	Drawing: 'SFW (Drawing)',
	Neutral: 'SFW',
	Porn: 'NSFW',
	Hentai: 'NSFW (Drawing)',
	Sexy: 'Suggestive'
};

module.exports = class NsfwImageCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'nsfw-image',
			aliases: ['nsfw', 'nsfw-img', 'img-nsfw', 'image-nsfw'],
			group: 'analyze',
			memberName: 'nsfw-image',
			description: 'Determines if an image is NSFW.',
			throttling: {
				usages: 2,
				duration: 30
			},
			args: [
				{
					key: 'image',
					prompt: 'What image would you like to test?',
					type: 'image-or-avatar'
				}
			]
		});
	}

	async run(msg, { image }) {
		try {
			const { body } = await request.get(image);
			const predictions = await isImageNSFW(this.client.nsfwModel, body, false);
			const formatted = predictions.map(result => {
				const percentage = Math.round(result.probability * 100);
				return `${percentage}% ${displayNames[result.className]}`;
			});
			return msg.reply(stripIndents`
				**This image gives the following results:**
				${formatted.join('\n')}
			`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
