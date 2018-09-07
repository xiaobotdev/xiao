const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const { list } = require('../../util/Util');
const subreddits = require('../../assets/json/meme');

module.exports = class MemeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'meme',
			group: 'random',
			memberName: 'meme',
			description: 'Responds with a random meme.',
			details: `**Subreddits:** ${subreddits.join(', ')}`,
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'subreddit',
					prompt: `What subreddit do you want to get memes from? Either ${list(subreddits, 'or')}.`,
					type: 'string',
					oneOf: subreddits,
					default: () => subreddits[Math.floor(Math.random() * subreddits.length)],
					parse: subreddit => subreddit.toLowerCase()
				}
			]
		});
	}

	async run(msg, { subreddit }) {
		try {
			const { body } = await request
				.get(`https://www.reddit.com/r/${subreddit}/top.json`)
				.query({
					sort: 'top',
					t: 'day',
					limit: 100
				});
			const posts = body.data.children.filter(post => post.data && post.data.post_hint === 'image' && post.data.url);
			if (!posts.length) return msg.reply(`I couldn't fetch any images from r/${subreddit}...`);
			const post = posts[Math.floor(Math.random() * posts.length)];
			return msg.say(stripIndents`
				**r/${subreddit}** ${post.data.title}
				${post.data.url}
			`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
