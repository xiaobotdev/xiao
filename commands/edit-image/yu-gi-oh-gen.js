const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { wrapText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Matrix Book.ttf'), { family: 'Matrix Book' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Matrix Small Caps.ttf'), { family: 'Matrix' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Stone Serif.ttf'), { family: 'Stone Serif' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Stone Serif Small Caps.ttf'), {
	family: 'Stone Serif Small Caps'
});

module.exports = class YuGiOhGenCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'yu-gi-oh-gen',
			aliases: ['ygo-gen', 'yu-gi-oh-generator', 'ygo-generator'],
			group: 'edit-image',
			memberName: 'yu-gi-oh-gen',
			description: 'Draws an image or a user\'s avatar on a Yu-Gi-Oh! Trading Card with the text of your choice.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Konami',
					url: 'https://www.konami.com/en/',
					reason: 'Images, Original "Yu-Gi-Oh!" Game',
					reasonURL: 'https://www.yugioh-card.com/en/'
				},
				{
					name: 'cylgom',
					url: 'https://www.deviantart.com/cylgom',
					reason: 'Card Base Template',
					reasonURL: 'https://www.deviantart.com/cylgom/art/Yu-GI-Oh-ultra-faithful-monster-card-template-728814822'
				},
				{
					name: 'icycatelf',
					url: 'https://www.deviantart.com/icycatelf',
					reason: 'Level Star Image',
					reasonURL: 'https://www.deviantart.com/icycatelf/art/Level-Star-Template-PSD-607344453'
				},
				{
					name: 'bushin',
					url: 'https://www.cardmaker.net/profile/220983-bushin/',
					reason: 'Fonts',
					// eslint-disable-next-line max-len
					reasonURL: 'https://www.cardmaker.net/forums/topic/308603-fonts-for-yu-gi-oh-card-making-with-multilingual-support/'
				}
			],
			args: [
				{
					key: 'name',
					prompt: 'What do you want the card to be named?',
					type: 'string',
					max: 50
				},
				{
					key: 'effect',
					prompt: 'What should the card\'s effect be?',
					type: 'string'
				},
				{
					key: 'type',
					prompt: 'What type should the card be?',
					type: 'string',
					max: 25
				},
				{
					key: 'level',
					prompt: 'What level should the card be?',
					type: 'integer',
					min: 1,
					max: 12
				},
				{
					key: 'attack',
					prompt: 'How much attack should the card have?',
					type: 'integer',
					min: 0,
					max: 9999
				},
				{
					key: 'defense',
					prompt: 'How much defense should the card have?',
					type: 'integer',
					min: 0,
					max: 9999
				},
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 256 })
				}
			]
		});
	}

	async run(msg, { name, effect, type, level, attack, defense, image }) {
		const id = Math.floor(Math.random() * 100000000);
		const setID = Math.floor(Math.random() * 1000);
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'yu-gi-oh-gen', 'base.png'));
			const atr = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'yu-gi-oh-gen', 'atr.png'));
			const levelI = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'yu-gi-oh-gen', 'level.png'));
			const line = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'yu-gi-oh-gen', 'line.png'));
			const { body } = await request.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, base.width, base.height);
			const height = 590 / data.width;
			ctx.drawImage(data, 109, 241, 590, data.height * height);
			ctx.drawImage(base, 0, 0);
			ctx.drawImage(atr, 669, 61, 77, 77);
			for (let i = 0; i < level; i++) {
				const levelX = 676 - (50 * i) - (5 * i);
				ctx.drawImage(levelI, levelX, 160, 50, 50);
			}
			ctx.font = '14px Noto';
			ctx.fillStyle = 'black';
			ctx.textBaseline = 'top';
			ctx.font = '87px Matrix';
			ctx.fillText(name, 74, 64, 585);
			ctx.font = '27px Matrix Book';
			const wrappedEffect = await wrapText(ctx, effect, 660);
			ctx.fillText(wrappedEffect.join('\n'), 78, 925);
			ctx.font = '31px Stone Serif Small Caps';
			ctx.fillText(`[ ${type} / Effect ]`, 77, 889);
			ctx.font = '22px Stone Serif';
			ctx.fillText(id.toString().padStart(8, '0'), 37, 1128);
			ctx.fillText(`XIAO-EN${setID.toString().padStart(3, '0')}`, 572, 850);
			ctx.font = '30px Stone Serif';
			ctx.fillText(`ATK/${attack}`, 419, 1076);
			ctx.fillText(`DEF/${defense}`, 578, 1076);
			ctx.drawImage(line, 80, 1073);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'yu-gi-oh-gen.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
