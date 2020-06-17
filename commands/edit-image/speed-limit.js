const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'HWYGWDE.ttf'), { family: 'Highway Gothic' });

module.exports = class SpeedLimitCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'speed-limit',
			aliases: ['speed', 'speed-limit-sign'],
			group: 'edit-image',
			memberName: 'speed-limit',
			description: 'Sends a Speed Limit sign with the limit of your choice.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'RoadTrafficSigns',
					url: 'https://www.roadtrafficsigns.com/',
					reason: 'Image',
					reasonURL: 'https://www.roadtrafficsigns.com/speed-limit-sign/speed-limit-70-sign/sku-x-r2-1-70.aspx'
				},
				{
					name: 'Ash Pikachu Font',
					url: 'https://www.dafont.com/ashpikachu099.d2541',
					reason: 'Highway Gothic Font',
					reasonURL: 'https://www.dafont.com/highway-gothic.font'
				},
				{
					name: 'Overtime2005',
					url: 'https://github.com/Overtime2005',
					reason: 'Concept'
				}
			],
			args: [
				{
					key: 'limit',
					prompt: 'What limit should be on the sign?',
					type: 'string',
					max: 5
				}
			]
		});
	}

	async run(msg, { limit }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'speed-limit.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.textBaseline = 'top';
		ctx.font = '360px Highway Gothic';
		ctx.fillStyle = 'black';
		ctx.fillText(limit.toUpperCase(), 87, 356, 475);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'speed-limit.png' }] });
	}
};
