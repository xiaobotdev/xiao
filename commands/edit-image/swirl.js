const Command = require('../../structures/Command');
const gm = require('gm').subClass({ imageMagick: true });
const request = require('node-superfetch');

module.exports = class SwirlCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'swirl',
			group: 'edit-image',
			memberName: 'swirl',
			description: 'Draws an image or a user\'s avatar but swirled.',
			throttling: {
				usages: 1,
				duration: 60
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'degrees',
					prompt: 'What degrees would you like to use? From 1-360.',
					type: 'integer',
					min: 1,
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
			const attachment = await this.toBuffer(magik);
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.say({ files: [{ attachment, name: 'swirl.png' }] });
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
