const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { list } = require('../../util/Util');
const frames = require('../../assets/json/frame');

module.exports = class FrameCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'frame',
			aliases: ['picture-frame', 'photo-frame'],
			group: 'edit-image',
			memberName: 'frame',
			description: 'Draws a frame around an image or a user\'s avatar.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'www.aljanh.net',
					url: 'http://www.aljanh.net/',
					reason: 'Classic Image',
					reasonURL: 'http://www.aljanh.net/frame-wallpapers/1508614706.html'
				}
			],
			args: [
				{
					key: 'frame',
					prompt: `What kind of frame do you want to use? Either ${list(Object.keys(frames), 'or')}.`,
					type: 'string',
					oneOf: Object.keys(frames),
					parse: frame => frames[frame.toLowerCase()]
				},
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { frame, image }) {
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'frame', frame.file));
			const { body } = await request.get(image);
			const data = await loadImage(body);
			let canvas;
			if (frame.stretch) {
				canvas = createCanvas(data.width, data.height);
				const ctx = canvas.getContext('2d');
				ctx.drawImage(data, 0, 0);
				ctx.drawImage(base, 0, 0, data.width, data.height);
			} else {
				canvas = createCanvas(base.width, base.height);
				const ctx = canvas.getContext('2d');
				ctx.drawImage(base, 0, 0);
				ctx.drawImage(data, frame.xStart, frame.yStart, frame.xSize, frame.ySize);
			}
			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.say({ files: [{ attachment, name: `frame-${frame.file}` }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
