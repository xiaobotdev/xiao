const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const gm = require('gm').subClass({ imageMagick: '7+' });
const request = require('node-superfetch');
const { magikToBuffer } = require('../../util/Util');

module.exports = class SquishCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'squish',
			aliases: ['stretch', 'flatten', 'flat'],
			group: 'edit-image',
			description: 'Draws an image or a user\'s avatar but squished across the X or Y axis.',
			throttling: {
				usages: 2,
				duration: 60
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
					key: 'axis',
					type: 'string',
					oneOf: ['x', 'y'],
					parse: axis => axis.toLowerCase()
				},
				{
					key: 'image',
					type: 'image-or-avatar',
					avatarSize: 512,
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 512, forceStatic: true })
				}
			]
		});
	}

	async run(msg, { axis, image }) {
		let command;
		if (axis === 'x') command = '15%x100%';
		if (axis === 'y') command = '100%x15%';
		const { body } = await request.get(image);
		const magik = gm(body);
		magik.out('-liquid-rescale');
		magik.out(command);
		magik.setFormat('png');
		const attachment = await magikToBuffer(magik);
		if (Buffer.byteLength(attachment) > 2.5e+7) return msg.reply('Resulting image was above 25 MB.');
		return msg.say({ files: [{ attachment, name: 'squish.png' }] });
	}
};
