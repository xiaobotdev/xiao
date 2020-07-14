const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const GIFEncoder = require('gifencoder');
const path = require('path');
const { streamToArray } = require('../../util/Util');
const frames = require('../../assets/json/illegal');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Impact.ttf'), { family: 'Impact' });

module.exports = class IllegalCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'illegal',
			aliases: ['is-now-illegal', 'trump'],
			group: 'edit-meme',
			memberName: 'illegal',
			description: 'Makes President Trump make your text illegal.',
			throttling: {
				usages: 1,
				duration: 30
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Donald J. Trump',
					url: 'https://www.donaldjtrump.com/',
					reason: 'Himself, Image'
				},
				{
					name: 'ShareFonts.net',
					url: 'https://www.wfonts.com/',
					reason: 'Impact Font',
					reasonURL: 'https://www.wfonts.com/font/impact'
				}
			],
			args: [
				{
					key: 'text',
					prompt: 'What should the text of the bill be?',
					type: 'string',
					max: 20,
					parse: text => text.toUpperCase()
				},
				{
					key: 'verb',
					prompt: 'Should the text use is, are, or am?',
					type: 'string',
					default: 'IS',
					oneOf: ['is', 'are', 'am'],
					parse: verb => verb.toUpperCase()
				}
			]
		});
	}

	async run(msg, { text, verb }) {
		const encoder = new GIFEncoder(262, 264);
		const stream = encoder.createReadStream();
		encoder.start();
		encoder.setRepeat(0);
		encoder.setDelay(100);
		encoder.setQuality(200);
		for (const frame of frames) {
			const img = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'illegal', frame.file));
			const canvas = createCanvas(img.width, img.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0);
			if (!frame.show) {
				encoder.addFrame(ctx);
				continue;
			}
			ctx.textBaseline = 'top';
			ctx.font = '20px Impact';
			ctx.textAlign = 'center';
			const widthMid = frame.corners[0][0] - frame.corners[2][0];
			const heightMid = frame.corners[0][1] - frame.corners[2][1];
			const maxLen = frame.corners[2][0] - frame.corners[0][0];
			console.log(widthMid, 'x', heightMid, 'x', maxLen);
			ctx.fillText(`${text}\n${verb} NOW\nILLEGAL`, widthMid, heightMid, maxLen);
			encoder.addFrame(ctx);
		}
		encoder.finish();
		const buffer = await streamToArray(stream);
		return msg.say({ files: [{ attachment: Buffer.concat(buffer), name: 'illegal.gif' }] });
	}
};
