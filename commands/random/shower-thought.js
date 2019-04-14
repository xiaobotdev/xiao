const SubredditCommand = require('../../structures/commands/Subreddit');

module.exports = class ShowerThoughtCommand extends SubredditCommand {
	constructor(client) {
		super(client, {
			name: 'shower-thought',
			aliases: ['shower-thoughts'],
			group: 'random',
			memberName: 'shower-thought',
			description: 'Responds with a random shower thought, directly from r/Showerthoughts.',
			subreddit: 'Showerthoughts',
			credit: [
				{
					name: 'r/Showerthoughts',
					url: 'https://www.reddit.com/r/showerthoughts'
				}
			]
		});
	}

	generateText(post) {
		return post.title;
	}
};
