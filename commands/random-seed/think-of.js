const Command = require('../../framework/Command');
const { MersenneTwister19937, integer } = require('random-js');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { LOVER_USER_ID } = process.env;
const thoughts = require('../../assets/json/think-of');

module.exports = class ThinkOfCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'think-of',
			aliases: ['thinks-of', 'thoughts-on', 't-of'],
			group: 'random-seed',
			memberName: 'think-of',
			description: 'Determines what a user thinks of another user.',
			throttling: {
				usages: 2,
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
					key: 'second',
					label: 'second user',
					type: 'user'
				},
				{
					key: 'first',
					label: 'first user',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	async run(msg, { first, second }) {
		let thought;
		const self = first.id === second.id;
		const owner = this.client.isOwner(first) || this.client.isOwner(second);
		const botUser = first.id === this.client.user.id || second.id === this.client.user.id;
		const girlfriendUser = first.id === LOVER_USER_ID || second.id === LOVER_USER_ID;
		if (owner && botUser) {
			thought = thoughts[8];
		} else if (self) {
			thought = thoughts[0];
		} else if (girlfriendUser && owner) {
			thought = thoughts[5];
		} else {
			const calculated = Number.parseInt(BigInt(first.id) - BigInt(second.id), 10);
			const random = MersenneTwister19937.seed(calculated);
			thought = thoughts[integer(0, thoughts.length - 1)(random)];
		}
		const firstAvatarURL = first.displayAvatarURL({ format: 'png', size: 512 });
		const secondAvatarURL = second.displayAvatarURL({ format: 'png', size: 512 });
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
		ctx.fillText('~Xiao\'s Thought Reader~', 600, 15);
		ctx.fillStyle = 'white';
		ctx.fillText(first.username, 270, 448);
		ctx.fillText(second.username, 930, 448);
		ctx.fillStyle = thought.color;
		ctx.font = this.client.fonts.get('Pinky Cupid.otf').toCanvasString(40);
		ctx.fillText('thinks they are', 600, 230);
		ctx.font = this.client.fonts.get('Pinky Cupid.otf').toCanvasString(60);
		ctx.fillText(thought.text, 600, 296);
		ctx.font = this.client.fonts.get('Pinky Cupid.otf').toCanvasString(90);
		ctx.fillText(thought.emoji, 600, 100);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'think-of.png' }] });
	}
};
