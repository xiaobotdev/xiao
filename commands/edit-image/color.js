const Command = require('../../framework/Command');
const { createCanvas } = require('canvas');
const ntc = require('ntcjs');

module.exports = class ColorCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'color',
			aliases: ['colour'],
			group: 'edit-image',
			memberName: 'color',
			description: 'Sends an image of the color you choose.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'color',
					prompt: 'What color do you want to view? This must be a #colorcode.',
					type: 'string',
					validate: color => /^#[0-9A-F]{6}$/i.test(color)
				}
			]
		});
	}

	run(msg, { color }) {
		const canvas = createCanvas(250, 250);
		const ctx = canvas.getContext('2d');
		const name = ntc.name(color);
		ctx.fillStyle = color.toLowerCase();
		ctx.fillRect(0, 0, 250, 250);
		return msg.say(`${color.toUpperCase()} - ${name[1]}`, {
			files: [{ attachment: canvas.toBuffer(), name: 'color.png' }]
		});
	}
};
