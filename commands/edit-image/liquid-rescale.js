const Command = require('../../framework/Command');
const gm = require('gm').subClass({ imageMagick: '7+' });
const request = require('node-superfetch');
const { magikToBuffer } = require('../../util/Util');

module.exports = class LiquidRescaleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'liquid-rescale',
			aliases: ['magick', 'magik'],
			group: 'edit-image',
			memberName: 'liquid-rescale',
			description: 'Draws an image or a user\'s avatar but with liquid rescale from ImageMagick.',
			throttling: {
				usages: 2,
				duration: 30
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'ImageMagick',
					url: 'https://imagemagick.org/index.php',
					reason: 'Image Manipulation'
				}
			],
			args: [
				{
					key: 'image',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { image }) {
		const { body } = await request.get(image);
		const magik = gm(body);
		magik.out('-liquid-rescale');
		magik.out('50%');
		magik.implode(0.25);
		magik.setFormat('png');
		const attachment = await magikToBuffer(magik);
		if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
		return msg.say({ files: [{ attachment, name: 'liquid-rescale.png' }] });
	}
};
