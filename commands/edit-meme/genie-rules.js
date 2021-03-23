const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');

module.exports = class GenieRulesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'genie-rules',
			aliases: ['genie', '4-rules', 'four-rules', 'there-are-four-rules', 'there-are-4-rules'],
			group: 'edit-meme',
			memberName: 'genie-rules',
			description: 'Sends a "There are 4 rules" meme with the text of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'u/Two-Tone-',
					url: 'https://www.reddit.com/user/Two-Tone-/',
					reason: 'Image',
					// eslint-disable-next-line max-len
					reasonURL: 'https://www.reddit.com/r/MemeTemplatesOfficial/comments/bht9o6/i_made_an_hd_high_quality_version_of_the_4_rules/'
				},
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Noto Font',
					reasonURL: 'https://www.google.com/get/noto/'
				}
			],
			args: [
				{
					key: 'text',
					prompt: 'What do you want to wish for?',
					type: 'string',
					max: 500
				}
			]
		});
	}

	async run(msg, { text }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'genie-rules.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(40);
		let fontSize = 40;
		while (ctx.measureText(text).width > 1143) {
			fontSize--;
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(fontSize);
		}
		const lines = await wrapText(ctx, text, 381);
		const topMost = 580 - (((fontSize * lines.length) / 2) + ((20 * (lines.length - 1)) / 2));
		for (let i = 0; i < lines.length; i++) {
			const height = topMost + ((fontSize + 20) * i);
			ctx.fillText(lines[i], 220, height);
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'genie-rules.png' }] });
	}
};
