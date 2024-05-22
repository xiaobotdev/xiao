const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const path = require('path');
const { wrapText, measureTextHeightWithBreaks } = require('../../util/Canvas');

module.exports = class SpongebobTimeCardCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'spongebob-time-card',
			aliases: [
				'time-card',
				'sb-time-card',
				'spongebob-card',
				'sb-card',
				'sponge-card',
				'sponge-time-card',
				'sb-time',
				'spongebob-time',
				'sponge-time'
			],
			group: 'edit-image-text',
			description: 'Sends a Spongebob Time Card with the text of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Nickelodeon',
					url: 'https://www.nick.com/',
					reason: 'Original "Spongebob Squarepants" Show',
					reasonURL: 'https://www.nick.com/shows/spongebob-squarepants'
				},
				{
					name: 'Spongebob Fanon',
					url: 'https://spongebob-new-fanon.fandom.com/wiki/SpongeBob_Fanon_Wiki',
					reason: 'Images',
					reasonURL: 'https://spongebob-new-fanon.fandom.com/wiki/Gallery_of_Textless_Title_Cards'
				},
				{
					name: 'nauticalspongeinc',
					url: 'https://www.fontspace.com/nauticalspongeinc',
					reason: 'Spongeboytt1 Font',
					reasonURL: 'https://www.fontspace.com/spongeboytt1-font-f29761'
				}
			],
			args: [
				{
					key: 'text',
					type: 'string',
					max: 280
				}
			]
		});
	}

	async run(msg, { text }) {
		const canvas = createCanvas(1920, 1080);
		const ctx = canvas.getContext('2d');
		const num = Math.floor(Math.random() * 23);
		const base = await loadImage(
			path.join(__dirname, '..', '..', 'assets', 'images', 'spongebob-time-card', `${num}.png`)
		);
		ctx.drawImage(base, 0, 0);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		let fontSize = 345;
		ctx.font = this.client.fonts.get('Spongeboytt1.ttf').toCanvasString(fontSize);
		let lines = wrapText(ctx, text.toUpperCase(), 1800);
		let longestLine = ctx.measureText(
			lines.sort((a, b) => ctx.measureText(b).width - ctx.measureText(a).width)[0]
		).width;
		let heightMetric = measureTextHeightWithBreaks(ctx, lines.join('\n'));
		while (longestLine > 1800 || heightMetric > 1000) {
			fontSize -= 10;
			ctx.font = this.client.fonts.get('Spongeboytt1.ttf').toCanvasString(fontSize);
			longestLine = ctx.measureText(lines.sort((a, b) => ctx.measureText(b).width - ctx.measureText(a).width)[0]).width;
			heightMetric = measureTextHeightWithBreaks(ctx, lines.join('\n'));
			lines = wrapText(ctx, text.toUpperCase(), 1800);
		}
		const topMost = (canvas.height / 2) - (((fontSize * lines.length) / 2) + ((60 * (lines.length - 1)) / 2));
		for (let i = 0; i < lines.length; i++) {
			const height = topMost + ((fontSize + 60) * i);
			ctx.fillStyle = '#ecbd3b';
			ctx.fillText(lines[i], (canvas.width / 2) + 6, height + 6);
			ctx.fillStyle = 'black';
			ctx.fillText(lines[i], canvas.width / 2, height);
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'spongebob-time-card.png' }] });
	}
};
