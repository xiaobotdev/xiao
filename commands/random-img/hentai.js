const SubredditCommand = require('../../framework/Commands/Subreddit');
const { list } = require('../../util/Util');
const subreddits = require('../../assets/json/hentai');

module.exports = class HentaiCommand extends SubredditCommand {
	constructor(client) {
		super(client, {
			name: 'hentai',
			group: 'random-img',
			memberName: 'hentai',
			description: 'Responds with a random hentai image.',
			details: `**Subreddits:** ${subreddits.join(', ')}`,
			clientPermissions: ['EMBED_LINKS'],
			nsfw: true,
			postType: 'image',
			getIcon: true,
			credit: [
				{
					name: '0vertime-dev',
					url: 'https://github.com/0vertime-dev',
					reason: 'Original Subreddit List'
				}
			],
			args: [
				{
					key: 'subreddit',
					prompt: `What subreddit do you want to get hentai from? Either ${list(subreddits, 'or')}.`,
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
