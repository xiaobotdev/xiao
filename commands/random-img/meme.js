const SubredditCommand = require('../../structures/commands/Subreddit');
const { list } = require('../../util/Util');
const subreddits = require('../../assets/json/meme');

module.exports = class MemeCommand extends SubredditCommand {
	constructor(client) {
		super(client, {
			name: 'meme',
			group: 'random-img',
			memberName: 'meme',
			description: 'Responds with a random meme.',
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
