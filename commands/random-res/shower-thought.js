const SubredditCommand = require('../../structures/commands/Subreddit');

module.exports = class ShowerThoughtCommand extends SubredditCommand {
	constructor(client) {
		super(client, {
			name: 'shower-thought',
			aliases: ['shower-thoughts', 'shower', 's-thought', 'shower-t'],
			group: 'random-res',
			memberName: 'shower-thought',
			description: 'Responds with a random shower thought, directly from r/Showerthoughts.',
			subreddit: 'Showerthoughts'
		});
	}

	generateText(post) {
		return post.title;
	}
};
