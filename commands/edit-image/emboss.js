const Command = require('../../framework/Command');
const gm = require('gm').subClass({ imageMagick: true });
const request = require('node-superfetch');
const { magikToBuffer } = require('../../util/Util');

module.exports = class EmbossCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'emboss',
			group: 'edit-image',
			memberName: 'emboss',
			description: 'Draws an image or a user\'s avatar but embossed.',
			throttling: {
				usages: 2,
				duration: 15
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
					prompt: 'What image would you like to edit?',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { image }) {
		const { body } = await request.get(image);
		const magik = gm(body);
		magik.emboss();
		magik.setFormat('png');
		const attachment = await magikToBuffer(magik);
		if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
		return msg.say({ files: [{ attachment, name: 'emboss.png' }] });
	}
};
