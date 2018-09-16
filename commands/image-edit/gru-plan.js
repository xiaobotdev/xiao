const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });
const coord = [[443, 139], [1200, 143], [443, 637], [1200, 637]];

module.exports = class GruPlanCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'gru-plan',
			aliases: ['grus-plan', 'gru', 'plan'],
			group: 'image-edit',
			memberName: 'gru-plan',
			description: 'Sends a Gru\'s Plan meme with steps of your choice.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'step1',
					label: 'step 1',
					prompt: 'What should the first step of Gru\'s plan be?',
					type: 'string',
					max: 500
				},
				{
					key: 'step2',
					label: 'step 2',
					prompt: 'What should the second step of Gru\'s plan be?',
					type: 'string',
					max: 500
				},
				{
					key: 'step3',
					label: 'step 3',
					prompt: 'What should the third step of Gru\'s plan be?',
					type: 'string',
					max: 500
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
		ctx.font = '50px Noto';
		ctx.textBaseline = 'top';
		let i = 0;
		for (const [x, y] of coord) {
			const step = steps[i];
			let fontSize = 50;
			while (ctx.measureText(step).width > 1237) {
				fontSize -= 1;
				ctx.font = `${fontSize}px Noto`;
			}
			ctx.fillText(wrapText(ctx, step, 252).join('\n'), x, y);
			i++;
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'gru-plan.png' }] });
	}
};
