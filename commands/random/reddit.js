const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');

module.exports = class RedditCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reddit',
			aliases: ['subreddit', 'r/'],
			group: 'random',
			memberName: 'reddit',
			description: 'Responds with a random post from a subreddit.',
			args: [
				{
					key: 'subreddit',
					prompt: 'What subreddit would you like to get a post from?',
					type: 'string',
					parse: subreddit => encodeURIComponent(subreddit)
				}
			]
		});
	}

	async run(msg, { subreddit }) {
		try {
			const { body } = await request
				.get(`https://www.reddit.com/r/${subreddit}/new.json`)
				.query({
					sort: 'new',
					limit: 100
				});
			const posts = body.data.children.filter(post => post.data && (msg.channel.nsfw ? true : !post.data.over_18));
			if (!posts.length) return msg.say('Could not find any results.');
			const post = posts[Math.floor(Math.random() * posts.length)].data;
			return msg.say(stripIndents`
				**${post.title}**
				<https://www.reddit.com${post.permalink}>

				⬆ ${post.ups} ⬇ ${post.downs}
			`);
		} catch (err) {
			if (err.status === 403) return msg.say('This subreddit is private.');
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
