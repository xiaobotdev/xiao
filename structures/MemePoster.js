const { POSTER_ID, POSTER_TOKEN, POSTER_TIME } = process.env;
const request = require('node-superfetch');
const subreddits = require('../assets/json/meme');
const types = ['image', 'rich:video'];

module.exports = class MemePoster {
	constructor(client) {
		Object.defineProperty(this, 'client', { value: client });

		this.id = POSTER_ID;
		this.token = POSTER_TOKEN;
		this.time = Number.parseFloat(POSTER_TIME) || 3.6e+6;
	}

	async post() {
		try {
			const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
			const post = await this.fetchMeme(subreddit);
			if (!post) return;
			await request
				.post(`https://discordapp.com/api/webhooks/${this.id}/${this.token}`)
				.send({
					content: `**r/${subreddit}** [${post.title}](<https://www.reddit.com${post.permalink}>)\n${post.url}`
				});
		} catch (err) {
			this.client.logger.error(err);
		}
	}

	async fetchMeme(subreddit) {
		const { body } = await request
			.get(`https://www.reddit.com/r/${subreddit}/hot.json`)
			.query({ limit: 100 });
		const posts = body.data.children.filter(post => {
			if (!post.data) return false;
			return types.includes(post.data.post_hint) && post.data.url && post.data.title && !post.data.over_18;
		});
		if (!posts.length) return null;
		return posts[Math.floor(Math.random() * posts.length)].data;
	}
};
