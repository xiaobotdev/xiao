const Command = require('../../structures/Command');
const request = require('node-superfetch');
const UserAgent = require('user-agents');
const { stripIndents } = require('common-tags');
const fileTypeRe = /\.(jpe?g|png|gif|jfif|bmp)(\?.+)?$/i;

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
		try {
			const { body } = await request.get(image);
			const results = await this.checkImage(body, image);
			if (results === false) return msg.reply('This image is clean.');
			return msg.reply(stripIndents`
				This image may be a repost. I've seen it **${results.matches.length}** times.
				The closest match is at **${results.closest_match.hamming_match_percent}%** similarity.
				${results.closest_match.post.url} 
			`);
		} catch (err) {
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
