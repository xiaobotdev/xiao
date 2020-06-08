const SubredditCommand = require('../../structures/commands/Subreddit');
const { list } = require('../../util/Util');
const subreddits = require('../../assets/json/porn');

module.exports = class PornCommand extends SubredditCommand {
	constructor(client) {
		super(client, {
			name: 'porn',
			aliases: ['pornography', 'porno'],
			group: 'random-img',
			memberName: 'porn',
			description: 'Responds with a random porn image.',
			details: `**Subreddits:** ${subreddits.join(', ')}`,
			clientPermissions: ['EMBED_LINKS'],
			nsfw: true,
			postType: 'image',
			getIcon: true,
			credit: [
				{
					name: 'Overtime2005',
					url: 'https://github.com/Overtime2005',
					reason: 'Original Subreddit List'
				}
			],
			args: [
				{
					key: 'subreddit',
					prompt: `What subreddit do you want to get porn from? Either ${list(subreddits, 'or')}.`,
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
