const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const gm = require('gm').subClass({ imageMagick: '7+' });
const request = require('node-superfetch');
const { magikToBuffer } = require('../../util/Util');

module.exports = class EmbossCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'emboss',
			group: 'edit-image',
			description: 'Draws an image or a user\'s avatar but embossed.',
			throttling: {
				usages: 2,
				duration: 15
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
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
					avatarSize: 512,
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 512 })
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
		if (Buffer.byteLength(attachment) > 2.5e+7) return msg.reply('Resulting image was above 25 MB.');
		return msg.say({ files: [{ attachment, name: 'emboss.png' }] });
	}
};
