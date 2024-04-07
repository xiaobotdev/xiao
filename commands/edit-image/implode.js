const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const gm = require('gm').subClass({ imageMagick: '7+' });
const request = require('node-superfetch');
const { magikToBuffer } = require('../../util/Util');

module.exports = class ImplodeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'implode',
			group: 'edit-image',
			memberName: 'implode',
			description: 'Draws an image or a user\'s avatar but imploded.',
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
					key: 'level',
					type: 'integer',
					min: 1,
					max: 100
				},
				{
					key: 'image',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { level, image }) {
		const { body } = await request.get(image);
		const magik = gm(body);
		magik.implode(level / 100);
		magik.setFormat('png');
		const attachment = await magikToBuffer(magik);
		if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
		return msg.say({ files: [{ attachment, name: 'implode.png' }] });
	}
};
