const Command = require('../../structures/Command');
const gm = require('gm').subClass({ imageMagick: true });
const request = require('node-superfetch');

module.exports = class MagikCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'magik',
			aliases: ['magick', 'liquid-rescale'],
			group: 'edit-image',
			memberName: 'magik',
			description: 'Draws an image or a user\'s avatar but with liquid rescale from ImageMagick.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { image }) {
		try {
			const { body } = await request.get(image);
			const magik = gm(body);
			gm.out('-liquid-rescale 75%x75%');
			gm.implode(0.25);
			const attachment = await this.toBuffer(gm);
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.say({ files: [{ attachment, name: 'magik.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	toBuffer(gm) {
		return new Promise((res, rej) => {
			gm.toBuffer('PNG', (err, buffer) => {
				if (err) return rej(err);
				return res(buffer);
			});
		});
	}
};
