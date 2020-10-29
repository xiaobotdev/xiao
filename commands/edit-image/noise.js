const Command = require('../../structures/Command');
const gm = require('gm').subClass({ imageMagick: true });
const request = require('node-superfetch');
const { list, magikToBuffer } = require('../../util/Util');
const types = ['uniform', 'gaussian', 'multiplicative', 'impulse', 'laplacian', 'poisson'];

module.exports = class NoiseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'noise',
			group: 'edit-image',
			memberName: 'noise',
			description: 'Draws an image or a user\'s avatar but with noise.',
			details: `**Types:** ${types.join(', ')}`,
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
					key: 'type',
					prompt: `What type of noise would you like to add? Either ${list(types, 'or')}.`,
					type: 'string',
					oneOf: types,
					default: 'poisson'
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

	async run(msg, { type, image }) {
		try {
			const { body } = await request.get(image);
			const magik = gm(body);
			magik.noise(type);
			magik.setFormat('png');
			const attachment = await magikToBuffer(magik);
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.say({ files: [{ attachment, name: 'noise.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
