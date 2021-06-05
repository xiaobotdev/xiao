const Command = require('../../framework/Command');
const request = require('node-superfetch');
const UserAgent = require('user-agents');
const { stripIndents } = require('common-tags');
const { reactIfAble } = require('../../util/Util');
const { LOADING_EMOJI_ID, SUCCESS_EMOJI_ID, FAILURE_EMOJI_ID } = process.env;
const fileTypeRe = /\.(jpe?g|png|gif|jfif|bmp)(\?.+)?$/i;
const notAllowed = ['gif', 'jfif', 'bmp'];

module.exports = class RepostCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'repost',
			aliases: ['repost-sleuth'],
			group: 'analyze',
			memberName: 'repost',
			description: 'Checks if an image is a repost.',
			credit: [
				{
					name: 'Reddit Repost Sleuth',
					url: 'https://www.repostsleuth.com/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'image',
					prompt: 'What image would you like to check?',
					type: 'image-or-avatar'
				}
			]
		});
	}

	async run(msg, { image }) {
		if (notAllowed.includes(image.toLowerCase().match(fileTypeRe)[1])) {
			return msg.reply('I cannot analyze images in this format.');
		}
		try {
			await reactIfAble(msg, this.client.user, LOADING_EMOJI_ID, '💬');
			const { body } = await request.get(image);
			const results = await this.checkImage(body, image);
			await reactIfAble(msg, this.client.user, SUCCESS_EMOJI_ID, '✅');
			if (results === false) return msg.reply('This image is clean.');
			return msg.reply(stripIndents`
				This image may be a repost. I've seen it **${results.matches.length + 1}** times.
				The closest match is at **${results.closest_match.hamming_match_percent}%** similarity.
				${results.closest_match.post.url} 
			`);
		} catch (err) {
			await reactIfAble(msg, msg.author, FAILURE_EMOJI_ID, '❌');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async checkImage(image, fileurl) {
		const { body } = await request
			.post('https://api.repostsleuth.com/image')
			.query({
				filter: true,
				same_sub: false,
				filter_author: false,
				only_older: false,
				include_crossposts: false,
				meme_filter: false,
				target_match_percent: 90,
				filter_dead_matches: false,
				target_days_old: 0
			})
			.attach('image', image, `image.${fileurl.match(fileTypeRe)[1]}`)
			.set({ 'user-agent': new UserAgent().toString() });
		if (!body.closest_match) return false;
		return body;
	}
};
