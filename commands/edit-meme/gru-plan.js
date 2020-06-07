const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });
const coord = [[450, 129], [1200, 134], [450, 627], [1200, 627]];

module.exports = class GruPlanCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'gru-plan',
			aliases: ['grus-plan', 'gru'],
			group: 'edit-meme',
			memberName: 'gru-plan',
			description: 'Sends a Gru\'s Plan meme with steps of your choice.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Illumination',
					url: 'http://www.illumination.com/',
					reason: 'Original "Despicable Me" Movie',
					reasonURL: 'http://www.despicable.me/'
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
					prompt: 'What should the first step of Gru\'s plan be?',
					type: 'string',
					max: 150
				},
				{
					key: 'step2',
					label: 'step 2',
					prompt: 'What should the second step of Gru\'s plan be?',
					type: 'string',
					max: 150
				},
				{
					key: 'step3',
					label: 'step 3',
					prompt: 'What should the third step of Gru\'s plan be?',
					type: 'string',
					max: 150
				}
			]
		});
	}

	async run(msg, { step1, step2, step3 }) {
		const steps = [step1, step2, step3, step3];
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'gru-plan.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.fillStyle = 'black';
		ctx.textBaseline = 'top';
		let i = 0;
		for (const [x, y] of coord) {
			ctx.font = '35px Noto';
			const step = steps[i];
			let fontSize = 35;
			while (ctx.measureText(step).width > 1100) {
				fontSize--;
				ctx.font = `${fontSize}px Noto`;
			}
			const lines = await wrapText(ctx, step, 252);
			ctx.fillText(lines.join('\n'), x, y);
			i++;
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'gru-plan.png' }] });
	}
};
