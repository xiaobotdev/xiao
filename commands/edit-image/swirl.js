const Command = require('../../structures/Command');
const gm = require('gm').subClass({ imageMagick: true });
const request = require('node-superfetch');
const { magikToBuffer } = require('../../util/Util');

module.exports = class SwirlCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'swirl',
			group: 'edit-image',
			memberName: 'swirl',
			description: 'Draws an image or a user\'s avatar but swirled.',
			throttling: {
				usages: 1,
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
					key: 'degrees',
					prompt: 'What degrees would you like to use? From -360-+360.',
					type: 'integer',
					min: -360,
					max: 360
				},
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { degrees, image }) {
		try {
			const { body } = await request.get(image);
			const magik = gm(body);
			magik.swirl(degrees);
			magik.setFormat('png');
			const attachment = await magikToBuffer(magik);
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.say({ files: [{ attachment, name: 'swirl.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
