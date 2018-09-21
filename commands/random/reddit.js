const SubredditCommand = require('../../structures/commands/Subreddit');
const { stripIndents } = require('common-tags');

module.exports = class RedditCommand extends SubredditCommand {
	constructor(client) {
		super(client, {
			name: 'reddit',
			aliases: ['subreddit', 'r', 'r/', 'sub'],
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

	generateText(post, subreddit) {
		return stripIndents`
			**r/${subreddit}** ${post.title}
			${post.url}

			⬆ ${post.ups} ⬇ ${post.downs}
		`;
	}
};
