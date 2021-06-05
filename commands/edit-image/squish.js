const Command = require('../../framework/Command');
const gm = require('gm').subClass({ imageMagick: true });
const request = require('node-superfetch');
const { magikToBuffer } = require('../../util/Util');

module.exports = class SquishCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'squish',
			aliases: ['stretch', 'flatten', 'flat'],
			group: 'edit-image',
			memberName: 'squish',
			description: 'Draws an image or a user\'s avatar but squished across the X or Y axis.',
			throttling: {
				usages: 2,
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
					key: 'axis',
					prompt: 'What axis do you want to squish?',
					type: 'string',
					oneOf: ['x', 'y'],
					parse: axis => axis.toLowerCase()
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

	async run(msg, { axis, image }) {
		let command;
		if (axis === 'x') command = '15%x100%';
		if (axis === 'y') command = '100%x15%';
		try {
			const { body } = await request.get(image);
			const magik = gm(body);
			magik.out('-liquid-rescale');
			magik.out(command);
			magik.setFormat('png');
			const attachment = await magikToBuffer(magik);
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.say({ files: [{ attachment, name: 'squish.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
