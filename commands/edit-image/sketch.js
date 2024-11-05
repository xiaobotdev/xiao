const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const gm = require('gm').subClass({ imageMagick: '7+' });
const request = require('node-superfetch');
const { readFile } = require('fs/promises');
const path = require('path');
const { magikToBuffer, reactIfAble } = require('../../util/Util');
const { LOADING_EMOJI_ID, SUCCESS_EMOJI_ID } = process.env;

module.exports = class SketchCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'sketch',
			aliases: ['pencil-sketch'],
			group: 'edit-image',
			description: 'Draws an image or a user\'s avatar but sketched.',
			throttling: {
				usages: 1,
				duration: 120
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'reiinakano',
					url: 'https://github.com/reiinakano',
					reason: 'Tensorflow Models',
					reasonURL: 'https://github.com/reiinakano/arbitrary-image-stylization-tfjs/'
				}
			],
			flags: [
				{
					key: 'classic',
					description: 'Uses the old sketch method.'
				},
				{
					key: 'c',
					description: 'Alias for classic.'
				}
			],
			args: [
				{
					key: 'image',
					type: 'image-or-avatar',
					maxAttachmentSize: 2e+6,
					avatarSize: 512,
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 512, forceStatic: true })
				}
			]
		});
	}

	async run(msg, { image, flags }) {
		const { body } = await request.get(image);
		await reactIfAble(msg, msg.author, LOADING_EMOJI_ID, '💬');
		let format = 'jpg';
		let attachment;
		if (flags.classic || flags.c) {
			const magik = gm(body);
			magik.colorspace('gray');
			magik.out('-sketch');
			magik.out('0x20+120');
			magik.setFormat('png');
			attachment = await magikToBuffer(magik);
			format = 'png';
		} else {
			const style = await readFile(path.join(__dirname, '..', '..', 'assets', 'images', 'sketch.jpg'));
			attachment = await this.client.tensorflow.stylizeImage(body, style);
		}
		await reactIfAble(msg, msg.author, SUCCESS_EMOJI_ID, '✅');
		if (Buffer.byteLength(attachment) > 2.5e+7) return msg.reply('Resulting image was above 25 MB.');
		return msg.say({ files: [{ attachment, name: `sketch.${format}` }] });
	}
};
