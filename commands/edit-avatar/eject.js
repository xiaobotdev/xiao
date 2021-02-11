const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const GIFEncoder = require('gifencoder');
const { MersenneTwister19937, bool } = require('random-js');
const request = require('node-superfetch');
const path = require('path');
const { streamToArray } = require('../../util/Util');
const frameCount = 52;
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class EjectCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'eject',
			group: 'edit-avatar',
			memberName: 'eject',
			description: 'Ejects a user.',
			throttling: {
				usages: 1,
				duration: 30
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Wisq',
					url: 'https://www.youtube.com/channel/UCrOS0iXaZgW45AdbEznGXLA',
					reason: 'Images',
					reasonURL: 'https://www.youtube.com/watch?v=yx4Hp8TBVtQ'
				},
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Noto Font',
					reasonURL: 'https://www.google.com/get/noto/'
				},
				{
					name: 'InnerSloth',
					url: 'https://innersloth.com/index.php',
					reason: 'Original "Among Us" Game',
					reasonURL: 'https://innersloth.com/gameAmongUs.php'
				}
			],
			args: [
				{
					key: 'user',
					prompt: 'Which user would you like to edit the avatar of?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	async run(msg, { user }) {
		const avatarURL = user.displayAvatarURL({ format: 'png', size: 512 });
		try {
			const { body } = await request.get(avatarURL);
			const avatar = await loadImage(body);
			const random = MersenneTwister19937.seed(user.id);
			const imposter = bool()(random);
			const text = `${user.username} was${imposter ? '' : ' not '} An Imposter.`;
			const encoder = new GIFEncoder(320, 180);
			const canvas = createCanvas(320, 180);
			const ctx = canvas.getContext('2d');
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillStyle = 'white';
			ctx.font = '18px Noto';
			const stream = encoder.createReadStream();
			encoder.start();
			encoder.setRepeat(0);
			encoder.setDelay(100);
			encoder.setQuality(200);
			for (let i = 0; i < frameCount; i++) {
				const frameID = `frame_${i.toString().padStart(2, '0')}.gif`;
				const frame = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'eject', frameID));
				if (i <= 11) {
					const rotation = (360 / 10) * i;
					const x = ((320 / 10) * i) + (rotation / 4);
					const y = ((frame.height / 2) - 25) - (rotation / 4);
					ctx.drawImage(frame, 0, 0);
					ctx.rotate(rotation * (Math.PI / 180));
					ctx.drawImage(avatar, x, y, 50, 50);
					ctx.rotate(-rotation * (Math.PI / 180));
				}
				if (i > 10) {
					if (i <= 20) {
						ctx.drawImage(frame, 0, 0);
						const letters = Math.ceil((text.length / 10) * ((i - 10) + 1));
						const toDraw = text.slice(0, letters + 1);
						ctx.fillText(toDraw, frame.width / 2, frame.height / 2, 300);
					} else {
						ctx.drawImage(frame, 0, 0);
						ctx.fillText(text, frame.width / 2, frame.height / 2, 300);
					}
				}
				encoder.addFrame(ctx);
			}
			encoder.finish();
			const buffer = await streamToArray(stream);
			return msg.say({ files: [{ attachment: Buffer.concat(buffer), name: 'eject.gif' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
