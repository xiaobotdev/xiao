const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const gm = require('gm').subClass({ imageMagick: '7+' });
const request = require('node-superfetch');
const { magikToBuffer, reactIfAble } = require('../../util/Util');
const { LOADING_EMOJI_ID, SUCCESS_EMOJI_ID } = process.env;

module.exports = class SketchCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'sketch',
			aliases: ['pencil-sketch'],
			group: 'edit-image',
			memberName: 'sketch',
			description: 'Draws an image or a user\'s avatar but sketched.',
			throttling: {
				usages: 1,
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
					key: 'image',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { image }) {
		const { body } = await request.get(image);
		await reactIfAble(msg, msg.author, LOADING_EMOJI_ID, '💬');
		const magik = gm(body);
		magik.colorspace('gray');
		magik.out('-sketch');
		magik.out('0x20+120');
		magik.setFormat('png');
		const attachment = await magikToBuffer(magik);
		reactIfAble(msg, msg.author, SUCCESS_EMOJI_ID, '✅');
		if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
		return msg.say({ files: [{ attachment, name: 'sketch.png' }] });
	}
};
