const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const { list } = require('../../util/Util');
const types = ['x', 'y', 'both'];

module.exports = class MirrorCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'mirror',
			group: 'edit-image',
			memberName: 'mirror',
			description: 'Draws an image or a user\'s avatar but mirrored on the X/Y axis (or both).',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'type',
					prompt: `What axis do you want to mirror? Either ${list(types, 'or')}.`,
					type: 'string',
					oneOf: types,
					parse: type => type.toLowerCase()
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

	async run(msg, { type, image }) {
		try {
			const { body } = await request.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');
			if (type === 'x') {
				ctx.translate(canvas.width, 0);
				ctx.scale(-1, 1);
			} else if (type === 'y') {
				ctx.translate(0, canvas.height);
				ctx.scale(1, -1);
			} else if (type === 'both') {
				ctx.translate(canvas.width, canvas.height);
				ctx.scale(-1, -1);
			}
			ctx.drawImage(data, 0, 0);
			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.say({ files: [{ attachment, name: 'mirror.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
