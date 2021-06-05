const SubredditCommand = require('../../structures/commands/Subreddit');
const { list } = require('../../util/Util');
const subreddits = ['interestingasfuck', 'mildlyinteresting', 'damnthatsinteresting'];

module.exports = class InterestingCommand extends SubredditCommand {
	constructor(client) {
		super(client, {
			name: 'interesting',
			aliases: ['interesting-as-fuck', 'mildly-interesting'],
			group: 'random-img',
			memberName: 'interesting',
			description: 'Responds with a random interesting image.',
			details: `**Subreddits:** ${subreddits.join(', ')}`,
			clientPermissions: ['EMBED_LINKS'],
			postType: 'image',
			getIcon: true,
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

	generateText(post, subreddit, icon) {
		return this.makeEmbed(post, subreddit, icon);
	}
};
