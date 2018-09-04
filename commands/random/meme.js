const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const subreddits = require('../../assets/json/meme');

module.exports = class MemeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'meme',
			group: 'random',
			memberName: 'meme',
			description: 'Responds with a random meme.',
			clientPermissions: ['ATTACH_FILES']
		});
	}

	async run(msg) {
		const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
		try {
			const { body } = await request.get(`https://www.reddit.com/r/${subreddit}/hot.json`);
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
