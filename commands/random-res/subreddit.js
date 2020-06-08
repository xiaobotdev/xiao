const SubredditCommandBase = require('../../structures/commands/Subreddit');

module.exports = class SubredditCommand extends SubredditCommandBase {
	constructor(client) {
		super(client, {
			name: 'subreddit',
			aliases: ['r/', 'sub'],
			group: 'random-res',
			memberName: 'subreddit',
			description: 'Responds with a random post from a subreddit.',
			clientPermissions: ['EMBED_LINKS'],
			patterns: [/^r\/(.+)/i],
			getIcon: true,
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

	generateText(post, subreddit, icon) {
		const embed = this.makeEmbed(post, subreddit, icon);
		if (post.thumbnail && post.thumbnail !== 'self' && post.post_hint !== 'image') {
			embed.setThumbnail(post.thumbnail);
		}
		return embed;
	}
};
