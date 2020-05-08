const { WebhookClient } = require('discord.js');
const request = require('node-superfetch');
const { embedURL } = require('../util/Util');

module.exports = class MemePosterClient extends WebhookClient {
	constructor(id, token, options) {
		super(id, token, options);

		this.subreddits = options.subreddits;
		this.postTypes = options.postTypes;
		this.postInterval = options.postInterval ? Number.parseFloat(options.postInterval) : 3.6e+6; 
	}

	post(post) {
		const url = embedURL(post.title, `<https://www.reddit.com${post.permalink}>`);
		return this.send(`**r/${subreddit}** ${url}\n${post.url}`);
	}

	async fetchRandomPost(nsfw) {
		const subreddit = this.randomSubreddit();
		const post = await this.fetchPost(subreddit, nsfw);
		return {
			subreddit,
			title: post.title,
			url: post.permalink,
			type: post.post_hint,
			nsfw: post.over_18 || false
		};
	}

	async fetchPost(subreddit, nsfw) {
		const { body } = await request
			.get(`https://www.reddit.com/r/${subreddit}/hot.json`)
			.query({ limit: 100 });
		const posts = body.data.children.filter(post => {
			if (!post.data) return false;
			return this.postTypes.includes(post.data.post_hint)
				&& post.data.url
				&& post.data.title
				&& nsfw ? true : !post.data.over_18;
		});
		if (!posts.length) return null;
		return posts[Math.floor(Math.random() * posts.length)].data;
	}

	randomSubreddit() {
		return this.subreddits[Math.floor(Math.random() * this.subreddits.length)];
	}
};
