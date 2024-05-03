const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const path = require('path');

module.exports = class HollywoodStarCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hollywood-star',
			aliases: ['hollywood', 'walk-of-fame', 'walk-of-fame-star'],
			group: 'edit-image-text',
			memberName: 'hollywood-star',
			description: 'Sends a Hollywood Walk of Fame star with the name of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'RedKid.Net',
					url: 'http://www.redkid.net/',
					reason: 'Image',
					reasonURL: 'http://www.redkid.net/generator/star/'
				},
				{
					name: 'Alexey Star',
					url: 'https://alexeystar.com/',
					reason: 'Hollywood Star Font',
					reasonURL: 'https://alexeystar.com/hollywood-star-font/'
				},
				{
					name: 'Hollywood Walk of Fame',
					url: 'https://walkoffame.com/',
					reason: 'Concept'
				}
			],
			args: [
				{
					key: 'name',
					type: 'string',
					max: 30
				}
			]
		});
	}

	async run(msg, { name }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'hollywood-star.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.font = this.client.fonts.get('HollywoodStar.otf').toCanvasString(28);
		ctx.fillStyle = '#fadfd4';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.fillText(name.toLowerCase(), 288, 140);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'hollywood-star.png' }] });
	}
};
