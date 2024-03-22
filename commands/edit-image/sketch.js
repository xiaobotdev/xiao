const Command = require('../../framework/Command');
const gm = require('gm').subClass({ imageMagick: true });
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
		try {
			const { body } = await request.get(image);
			await reactIfAble(msg, this.client.user, LOADING_EMOJI_ID, '💬');
			const magik = gm(body);
			magik.colorspace('gray');
			magik.out('-sketch');
			magik.out('0x20+120');
			magik.setFormat('png');
			const attachment = await magikToBuffer(magik);
			reactIfAble(res, res.author, SUCCESS_EMOJI_ID, '✅');
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.say({ files: [{ attachment, name: 'sketch.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
