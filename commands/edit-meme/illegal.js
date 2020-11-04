const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const { default: drawText } = require('node-canvas-text');
const GIFEncoder = require('gifencoder');
const opentype = require('opentype.js');
const path = require('path');
const { streamToArray } = require('../../util/Util');
const frames = require('../../assets/json/illegal');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Impact.ttf'), { family: 'Impact' });
const impactFont = opentype.loadSync(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Impact.ttf'));

module.exports = class IllegalCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'illegal',
			aliases: ['is-now-illegal', 'trump'],
			group: 'edit-meme',
			memberName: 'illegal',
			description: 'Makes Donald Trump make your text illegal.',
			throttling: {
				usages: 1,
				duration: 30
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Donald J. Trump',
					url: 'https://www.donaldjtrump.com/',
					reason: 'Himself'
				},
				{
					name: 'IsNowIllegal.com',
					url: 'http://isnowillegal.com/',
					reason: 'Images',
					reasonURL: 'https://github.com/ivanseidel/Is-Now-Illegal/tree/master/GIF/Trump'
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
			const rect = {
				x: frame.corners[0][0],
				y: frame.corners[0][1],
				width: frame.corners[0][0],
				height: frame.corners[1][0]
			};
			drawText(ctx, `${text}\n${verb} NOW\nILLEGAL`, impactFont, rect, {
				minSize: 5,
				maxSize: 20,
				hAlign: 'center',
				wAlign: 'center',
				textPadding: 5
			});
			encoder.addFrame(ctx);
		}
		encoder.finish();
		const buffer = await streamToArray(stream);
		return msg.say({ files: [{ attachment: Buffer.concat(buffer), name: 'illegal.gif' }] });
	}
};
