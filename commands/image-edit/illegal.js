const { Command } = require('discord.js-commando');
const { createCanvas, loadImage, registerFont } = require('canvas');
const { stripIndents } = require('common-tags');
const path = require('path');
const { shortenText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class IllegalCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'illegal',
			aliases: ['is-now-illegal', 'trump', 'first-order-of-business'],
			group: 'image-edit',
			memberName: 'illegal',
			description: 'Makes President Trump make your text illegal.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'text',
					prompt: 'What should the text of the bill be?',
					type: 'string',
					parse: text => text.toUpperCase()
				},
				{
					key: 'isOrAre',
					label: 'is or are',
					prompt: 'Should the text use is or are?',
					type: 'string',
					default: 'IS',
					validate: isOrAre => {
						if (['is', 'are'].includes(isOrAre.toLowerCase())) return true;
						return 'Invalid is or are, please enter either is or are.';
					},
					parse: isOrAre => isOrAre.toUpperCase()
				}
			]
		});
	}

	async run(msg, { text, isOrAre }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'illegal.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.rotate(7 * (Math.PI / 180));
		ctx.font = '45px Noto';
		ctx.fillText(stripIndents`
			${shortenText(ctx, text, 200)}
			${isOrAre} NOW
			ILLEGAL.
		`, 750, 290);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'illegal.png' }] });
	}
};
