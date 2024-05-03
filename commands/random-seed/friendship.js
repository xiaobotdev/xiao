const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { MersenneTwister19937, integer } = require('random-js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');
const { percentColor } = require('../../util/Util');
const percentColors = [
	{ pct: 0.0, color: { r: 0, g: 0, b: 255 } },
	{ pct: 0.5, color: { r: 0, g: 255 / 2, b: 255 / 2 } },
	{ pct: 1.0, color: { r: 0, g: 255, b: 0 } }
];

module.exports = class FriendshipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'friendship',
			aliases: ['friendship-meter', 'friends', 'friend', 'friendship-tester', 'friendship-test', 'friend-test'],
			group: 'random-seed',
			memberName: 'friendship',
			description: 'Determines how good friends two users are.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
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
					type: 'user'
				},
				{
					key: 'second',
					label: 'second user',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	async run(msg, { first, second }) {
		let level;
		const self = first.id === second.id;
		const owner = this.client.isOwner(first) || this.client.isOwner(second);
		const authorUser = first.id === msg.author.id || second.id === msg.author.id;
		const botUser = first.id === this.client.user.id || second.id === this.client.user.id;
		if (owner && botUser) {
			if (authorUser) level = 100;
			else level = 0;
		} else if (self) {
			level = 100;
		} else {
			const calculated = -Math.abs(Number.parseInt(BigInt(first.id) - BigInt(second.id), 10));
			const random = MersenneTwister19937.seed(calculated);
			level = integer(0, 100)(random);
		}
		const firstAvatarURL = first.displayAvatarURL({ extension: 'png', size: 512 });
		const secondAvatarURL = second.displayAvatarURL({ extension: 'png', size: 512 });
		const firstAvatarData = await request.get(firstAvatarURL);
		const firstAvatar = await loadImage(firstAvatarData.body);
		const secondAvatarData = await request.get(secondAvatarURL);
		const secondAvatar = await loadImage(secondAvatarData.body);
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'friendship.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(firstAvatar, 70, 56, 400, 400);
		ctx.drawImage(secondAvatar, 730, 56, 400, 400);
		ctx.drawImage(base, 0, 0);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.fillStyle = 'green';
		ctx.font = this.client.fonts.get('Pinky Cupid.otf').toCanvasString(40);
		ctx.fillText('~Xiao\'s Friendship Meter~', 600, 15);
		ctx.fillStyle = 'white';
		ctx.fillText(first.username, 270, 448);
		ctx.fillText(second.username, 930, 448);
		ctx.font = this.client.fonts.get('Pinky Cupid.otf').toCanvasString(60);
		ctx.fillStyle = percentColor(level / 100, percentColors);
		ctx.fillText(`~${level}%~`, 600, 230);
		ctx.fillText(this.calculateLevelText(level, self, owner, authorUser, botUser), 600, 296);
		ctx.font = this.client.fonts.get('Pinky Cupid.otf').toCanvasString(90);
		ctx.fillText(level > 49 ? '👍' : '👎', 600, 100);
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'friendship.png' }] });
	}

	calculateLevelText(level, self, owner, authorUser, botUser) {
		if (owner && botUser) {
			if (authorUser) return 'Perfect';
			else return 'Yuck';
		}
		if (self) return 'Narcissist';
		if (level === 0) return 'Abysmal';
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
		if (level === 100) return 'Besties';
		return '???';
	}
};
