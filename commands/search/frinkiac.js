const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const request = require('node-superfetch');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const moment = require('moment');
const { shortenText, fillTextWithBreaks } = require('../../util/Canvas');

module.exports = class FrinkiacCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'frinkiac',
			aliases: ['the-simpsons', 'simpsons', 'simpson'],
			group: 'search',
			description: 'Input a line from the Simpsons to get the episode/season.',
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Frinkiac',
					url: 'https://frinkiac.com/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'query',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		const search = await this.search(query);
		if (!search) return msg.say('Could not find any results.');
		const data = await this.fetchCaption(search.Episode, search.Timestamp);
		const time = moment.duration(data.Frame.Timestamp).format();
		const caption = data.Subtitles.map(sub => sub.Content).join(' ').split(' ');
		const image = await this.fetchImage(search.Episode, search.Timestamp);
		const wrapped = [''];
		let currentLine = 0;
		for (const word of caption) {
			if (wrapped[currentLine].length + word.length < 26) {
				wrapped[currentLine] += ` ${word}`;
			} else {
				wrapped.push(` ${word}`);
				currentLine++;
			}
		}
		const attachment = await this.subtitleImage(image, wrapped);
		const seasonEpisode = `S${data.Episode.Season}E${data.Episode.EpisodeNumber}`;
		return msg.say(
			`This is from **${seasonEpisode} ("${data.Episode.Title}") @ ${time}**.`,
			{ files: [{ attachment, name: 'frinkiac.png' }] }
		);
	}

	async search(query) {
		const { body } = await request
			.get('https://frinkiac.com/api/search')
			.query({ q: query });
		if (!body.length) return null;
		return body[0];
	}

	async fetchCaption(ep, ts) {
		const { body } = await request
			.get('https://frinkiac.com/api/caption')
			.query({
				e: ep,
				t: ts
			});
		return body;
	}

	async fetchImage(ep, ts) {
		const { body } = await request.get(`https://frinkiac.com/img/${ep}/${ts}.jpg`);
		return body;
	}

	async subtitleImage(image, lines) {
		const base = await loadImage(image);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		const fontSize = Math.round(base.height / 15);
		ctx.font = this.client.fonts.get('akbar.ttf').toCanvasString(fontSize);
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'bottom';
		const initial = base.height - ((lines.length - 1) * fontSize) - (fontSize / 2) - ((lines.length - 1) * 10);
		for (let i = 0; i < lines.length; i++) {
			const textHeight = initial + (i * fontSize) + (i * 10);
			ctx.strokeStyle = 'black';
			const rounded = Math.round(base.height / 100);
			ctx.lineWidth = rounded < 1 ? 1 : rounded;
			ctx.strokeText(lines[i], base.width / 2, textHeight);
			ctx.fillStyle = 'white';
			ctx.fillText(lines[i], base.width / 2, textHeight);
		}
		return canvas.toBuffer('image/png');
	}
};
