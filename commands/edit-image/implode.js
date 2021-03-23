const Command = require('../../structures/Command');
const gm = require('gm').subClass({ imageMagick: true });
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
					key: 'level',
					prompt: 'What level would you like to use? From 1-100.',
					type: 'integer',
					min: 1,
					max: 100
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

	async run(msg, { level, image }) {
		try {
			const { body } = await request.get(image);
			const magik = gm(body);
			magik.implode(level / 100);
			magik.setFormat('png');
			const attachment = await magikToBuffer(magik);
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.say({ files: [{ attachment, name: 'implode.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
