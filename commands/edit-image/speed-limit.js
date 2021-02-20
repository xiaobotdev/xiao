const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

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
		ctx.textAlign = 'center';
		ctx.font = this.client.fonts.get('HWYGWDE.ttf').toCanvasString(360);
		ctx.fillStyle = 'black';
		ctx.fillText(limit.toUpperCase(), 313, 356, 475);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'speed-limit.png' }] });
	}
};
