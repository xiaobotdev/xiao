const SubredditCommand = require('../../framework/Commands/Subreddit');
const { list } = require('../../util/Util');
const subreddits = require('../../assets/json/news');

module.exports = class NewsCommand extends SubredditCommand {
	constructor(client) {
		super(client, {
			name: 'news',
			group: 'random-res',
			memberName: 'news',
			description: 'Responds with a random news article.',
			details: `**Subreddits:** ${subreddits.join(', ')}`,
			clientPermissions: ['EMBED_LINKS'],
			getIcon: true,
			args: [
				{
					key: 'subreddit',
					prompt: `What subreddit do you want to get news from? Either ${list(subreddits, 'or')}.`,
					type: 'string',
					oneOf: subreddits,
					parse: subreddit => subreddit.toLowerCase()
				}
			]
		});
	}

	generateText(post, subreddit, icon) {
		return this.makeEmbed(post, subreddit, icon);
	}
};
