const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { createCanvas, loadImage } = require('canvas');
const { stripIndents } = require('common-tags');
const { base64, reactIfAble } = require('../../util/Util');
const { LOADING_EMOJI_ID, SUCCESS_EMOJI_ID, FAILURE_EMOJI_ID } = process.env;

module.exports = class WhatAnimeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'what-anime',
			aliases: ['anime-source', 'anime-src', 'trace-moe'],
			group: 'analyze',
			memberName: 'what-anime',
			description: 'Determines what anime a screenshot is from.',
			throttling: {
				usages: 2,
				duration: 30
			},
			credit: [
				{
					name: 'WAIT: What Anime Is This?',
					url: 'https://trace.moe/',
					reason: 'API',
					reasonURL: 'https://soruly.github.io/trace.moe/#/'
				}
			],
			args: [
				{
					key: 'screenshot',
					prompt: 'What screenshot do you want to scan?',
					type: 'image'
				}
			]
		});
	}

	async run(msg, { screenshot }) {
		try {
			await reactIfAble(msg, this.client.user, LOADING_EMOJI_ID, '💬');
			const status = await this.fetchRateLimit();
			if (!status.status) {
				await reactIfAble(msg, msg.author, FAILURE_EMOJI_ID, '❌');
				return msg.reply(`Oh no, I'm out of requests! Please wait ${status.refresh} seconds and try again.`);
			}
			let { body } = await request.get(screenshot);
			if (screenshot.endsWith('.gif')) body = await this.convertGIF(body);
			const result = await this.search(body, msg.channel.nsfw);
			if (result === 'size') {
				await reactIfAble(msg, msg.author, FAILURE_EMOJI_ID, '❌');
				return msg.reply('Please do not send an image larger than 10MB.');
			}
			if (result.nsfw && !msg.channel.nsfw) {
				await reactIfAble(msg, msg.author, FAILURE_EMOJI_ID, '❌');
				return msg.reply('This is from a hentai, and this isn\'t an NSFW channel, pervert.');
			}
			await reactIfAble(msg, this.client.user, SUCCESS_EMOJI_ID, '✅');
			const title = `${result.title}${result.episode ? ` episode ${result.episode}` : ''}`;
			return msg.reply(stripIndents`
				I'm ${result.prob}% sure this is from ${title}.
				${result.prob < 90 ? '_This probablity is rather low, try using a higher quality image._' : ''}
			`, result.preview ? { files: [{ attachment: result.preview, name: 'preview.mp4' }] } : {});
		} catch (err) {
			await reactIfAble(msg, msg.author, FAILURE_EMOJI_ID, '❌');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchRateLimit() {
		try {
			const { body } = await request.get('https://trace.moe/api/me');
			return { status: body.user_limit > 0, refresh: body.user_limit_ttl };
		} catch {
			return { status: false, refresh: Infinity };
		}
	}

	async search(file) {
		if (Buffer.byteLength(file) > 1e+7) return 'size';
		const { body } = await request
			.post('https://trace.moe/api/search')
			.attach('image', base64(file));
		const data = body.docs[0];
		return {
			prob: Math.round(data.similarity * 100),
			episode: data.episode,
			title: data.title_english,
			preview: await this.fetchPreview(data),
			nsfw: data.is_adult
		};
	}

	async fetchPreview(data) {
		try {
			const { body } = await request
				.get(`https://media.trace.moe/video/${data.anilist_id}/${encodeURIComponent(data.filename)}`)
				.query({
					t: data.at,
					token: data.tokenthumb,
					mute: true,
					size: 'm'
				});
			return body;
		} catch {
			return null;
		}
	}

	async convertGIF(image) {
		const data = await loadImage(image);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0);
		return canvas.toBuffer();
	}
};
