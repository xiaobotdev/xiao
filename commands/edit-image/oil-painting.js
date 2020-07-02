const Command = require('../../structures/Command');
const gm = require('gm').subClass({ imageMagick: true });
const request = require('node-superfetch');

module.exports = class OilPaintingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'oil-painting',
			aliases: ['oil', 'paint', 'painting'],
			group: 'edit-image',
			memberName: 'oil-painting',
			description: 'Draws an image or a user\'s avatar but with oil paints.',
			throttling: {
				usages: 1,
				duration: 60
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
			magik.paint(5);
			magik.setFormat('png');
			const attachment = await this.toBuffer(magik);
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.say({ files: [{ attachment, name: 'old-painting.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	toBuffer(magik) {
		return new Promise((res, rej) => {
			magik.toBuffer((err, buffer) => {
				if (err) return rej(err);
				return res(buffer);
			});
		});
	}
};
