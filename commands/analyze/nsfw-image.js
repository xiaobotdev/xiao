const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
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
					type: 'image-or-avatar',
					avatarSize: 256
				}
			]
		});
	}

	async run(msg, { image }) {
		const { body } = await request.get(image);
		const predictions = await this.client.tensorflow.isImageNSFW(body, false);
		const formatted = predictions.map(result => {
			const percentage = Math.round(result.probability * 100);
			return `${percentage}% ${displayNames[result.className]}`;
		});
		return msg.reply(stripIndents`
			**This image gives the following results:**
			${formatted.join('\n')}
		`);
	}
};
