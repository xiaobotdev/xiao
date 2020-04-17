const Command = require('../../structures/Command');
const { MersenneTwister19937, integer } = require('random-js');
const { createCanvas, loadImage, registerFont } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Pinky Cupid.otf'), { family: 'Pinky Cupid' });
const percentColors = [
	{ pct: 0.0, color: { r: 0, g: 0, b: 255 } },
	{ pct: 0.5, color: { r: 255 / 2, g: 0, b: 255 / 2 } },
	{ pct: 1.0, color: { r: 255, g: 0, b: 0 } }
];

module.exports = class ShipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ship',
			group: 'random-seed',
			memberName: 'ship',
			description: 'Ships two users together.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Attype Studio',
					url: 'https://www.dafont.com/fadli-ramadhan-iskandar.d7339',
					reason: 'Pinky Cupid Font',
					reasonURL: 'https://www.dafont.com/pinky-cupid.font'
				}
			],
			args: [
				{
					key: 'first',
					label: 'first user',
					prompt: 'Who is the first user in the ship?',
					type: 'user'
				},
				{
					key: 'second',
					label: 'second user',
					prompt: 'Who is the second user in the ship?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	async run(msg, { first, second }) {
		if (first.id === second.id) return msg.reply('Shipping someone with themselves would be pretty weird.');
		const calculated = Math.abs(Number.parseInt(BigInt(first.id) - BigInt(second.id), 10));
		const random = MersenneTwister19937.seed(calculated);
		const level = integer(0, 100)(random);
		const firstAvatarURL = first.displayAvatarURL({ format: 'png', size: 512 });
		const secondAvatarURL = second.displayAvatarURL({ format: 'png', size: 512 });
		try {
			const firstAvatarData = await request.get(firstAvatarURL);
			const firstAvatar = await loadImage(firstAvatarData.body);
			const secondAvatarData = await request.get(secondAvatarURL);
			const secondAvatar = await loadImage(secondAvatarData.body);
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'ship.png'));
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(firstAvatar, 70, 56, 400, 400);
			ctx.drawImage(secondAvatar, 730, 56, 400, 400);
			ctx.drawImage(base, 0, 0);
			ctx.textAlign = 'center';
			ctx.textBaseline = 'top';
			ctx.fillStyle = '#ff6c6c';
			ctx.font = '40px Pinky Cupid';
			ctx.fillText('~Xiao\'s Compatability Meter~', 600, 15);
			ctx.fillStyle = 'white';
			ctx.fillText(first.username, 270, 448);
			ctx.fillText(second.username, 930, 448);
			ctx.font = '60px Pinky Cupid';
			ctx.fillStyle = this.percentColor(level / 100);
			ctx.fillText(`~${level}%~`, 600, 230);
			ctx.fillText(this.calculateLevelText(level), 600, 296);
			ctx.font = '90px Pinky Cupid';
			ctx.fillText(level > 49 ? '❤️' : '💔', 600, 100);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'ship.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	calculateLevelText(level) {
		if (level === 0) return 'Abyssmal';
		if (level > 0 && level < 10) return 'Horrid';
		if (level > 9 && level < 20) return 'Awful';
		if (level > 19 && level < 30) return 'Very Bad';
		if (level > 29 && level < 40) return 'Bad';
		if (level > 39 && level < 50) return 'Poor';
		if (level > 49 && level < 60) return 'Average';
		if (level > 59 && level < 70) {
			if (level === 69) return 'Nice';
			return 'Fine';
		}
		if (level > 69 && level < 80) return 'Good';
		if (level > 79 && level < 90) return 'Great';
		if (level > 89 && level < 100) return 'Amazing';
		if (level === 100) return 'Soulmates';
		return '???';
	}
	
	percentColor(pct) {
		let i = 1;
		for (i; i < percentColors.length - 1; i++) {
			if (pct < percentColors[i].pct) {
				break;
			}
		}
		const lower = percentColors[i - 1];
		const upper = percentColors[i];
		const range = upper.pct - lower.pct;
		const rangePct = (pct - lower.pct) / range;
		const pctLower = 1 - rangePct;
		const pctUpper = rangePct;
		const color = {
			r: Math.floor((lower.color.r * pctLower) + (upper.color.r * pctUpper)).toString(16).padStart(2, '0'),
			g: Math.floor((lower.color.g * pctLower) + (upper.color.g * pctUpper)).toString(16).padStart(2, '0'),
			b: Math.floor((lower.color.b * pctLower) + (upper.color.b * pctUpper)).toString(16).padStart(2, '0')
		};
		return `#${color.r}${color.g}${color.b}`;
	};
};
