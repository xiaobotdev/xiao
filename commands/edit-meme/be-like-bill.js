const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const { stripIndents } = require('common-tags');
const path = require('path');
const { wrapText } = require('../../util/Canvas');
const texts = require('../../assets/json/be-like-bill');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'arialbd.ttf'), { family: 'Arial', weight: 'bold' });

module.exports = class BeLikeBillCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'be-like-bill',
			aliases: ['be-like'],
			group: 'edit-meme',
			memberName: 'be-like-bill',
			description: 'Sends a "Be Like Bill" meme with the name of your choice.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'gautamkrishnar',
					url: 'https://github.com/gautamkrishnar/',
					reason: 'Image',
					reasonURL: 'https://github.com/gautamkrishnar/Be-Like-Bill'
				},
				{
					name: 'Monotype',
					url: 'https://www.monotype.com/',
					reason: 'Arial Font',
					reasonURL: 'https://catalog.monotype.com/family/monotype/arial'
				}
			],
			args: [
				{
					key: 'name',
					prompt: 'What should the name on the meme be?',
					type: 'string',
					default: 'Bill',
					max: 20
				}
			]
		});
	}

	async run(msg, { name }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'be-like-bill.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.font = 'normal bold 23px Arial';
		const text = await wrapText(ctx, texts[Math.floor(Math.random() * texts.length)].replaceAll('{{name}}', name), 569);
		ctx.fillText(stripIndents`
			This is ${name}.

			${text.join('\n')}

			${name} is smart.
			Be like ${name}.
		`, 31, 80);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'be-like-bill.png' }] });
	}
};
