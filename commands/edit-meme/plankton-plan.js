const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const path = require('path');
const { wrapText, fillTextWithBreaks } = require('../../util/Canvas');
const coord = [[240, 63], [689, 63], [705, 383], [220, 380]];

module.exports = class PlanktonPlanCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'plankton-plan',
			aliases: ['planktons-plan', 'plankton'],
			group: 'edit-meme',
			memberName: 'plankton-plan',
			description: 'Sends a Plankton\'s Plan meme with steps of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Nickelodeon',
					url: 'https://www.nick.com/',
					reason: 'Image, Original "Spongebob Squarepants" Show',
					reasonURL: 'https://www.nick.com/shows/spongebob-squarepants'
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
					key: 'step1',
					label: 'step 1',
					type: 'string',
					max: 150
				},
				{
					key: 'step2',
					label: 'step 2',
					type: 'string',
					max: 150
				},
				{
					key: 'step3',
					label: 'step 3',
					type: 'string',
					max: 150
				}
			]
		});
	}

	async run(msg, { step1, step2, step3 }) {
		const steps = [step1, step2, step3, step3];
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'plankton-plan.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.fillStyle = 'black';
		ctx.textBaseline = 'top';
		let i = 0;
		for (const [x, y] of coord) {
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(35);
			const step = steps[i];
			let fontSize = 35;
			while (ctx.measureText(step).width > 420) {
				fontSize--;
				ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(fontSize);
			}
			const lines = wrapText(ctx, step, 155);
			fillTextWithBreaks(ctx, lines.join('\n'), x, y);
			i++;
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'plankton-plan.png' }] });
	}
};
