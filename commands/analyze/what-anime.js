const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { base64 } = require('../../util/Util');
const { WHATANIME_KEY } = process.env;

module.exports = class WhatAnimeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'what-anime',
			aliases: ['whatanime.ga', 'anime-source', 'anime-sauce', 'weeb-sauce'],
			group: 'analyze',
			memberName: 'what-anime',
			description: 'Determines what anime a screenshot is from.',
			args: [
				{
					key: 'screenshot',
					prompt: 'What screenshot do you want to scan?',
					type: 'image',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { screenshot }) {
		try {
			const status = await this.fetchRateLimit();
			if (!status.status) {
				return msg.reply(`Oh no, I'm out of requests! Please wait ${status.refresh} seconds and try again.`);
			}
			const { body } = await request.get(screenshot);
			const result = await this.search(body, msg.channel.nsfw);
			if (result === 'size') return msg.reply('Please do not send an image larger than 1MB.');
			if (result.nsfw) return msg.reply('This is from a hentai, and this isn\'t an NSFW channel, pervert.');
			return msg.reply(
				`I'm ${result.prob}% sure this is from ${result.title}${result.episode
					? ` episode ${result.episode}`
					: ''}.`,
				result.preview ? { files: [{ attachment: result.preview, name: 'preview.mp4' }] } : {}
			);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchRateLimit() {
		try {
			const { body } = await request
				.get('https://whatanime.ga/api/me')
				.query({ token: WHATANIME_KEY });
			return { status: body.quota > 0, refresh: body.quota_ttl };
		} catch (err) {
			return { status: false, refresh: Infinity };
		}
	}

	async search(file) {
		if (Buffer.byteLength(file) > 1e+6) return 'size';
		const { body } = await request
			.post('https://whatanime.ga/api/search')
			.query({ token: WHATANIME_KEY })
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
				.get('https://whatanime.ga/preview.php')
				.query({
					anilist_id: data.anilist_id,
					file: data.filename,
					t: data.at,
					token: data.tokenthumb
				});
			return body;
		} catch (err) {
			return null;
		}
	}
};
