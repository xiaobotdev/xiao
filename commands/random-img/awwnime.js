const SubredditCommand = require('../../framework/Commands/Subreddit');

module.exports = class AwwnimeCommand extends SubredditCommand {
	constructor(client) {
		super(client, {
			name: 'awwnime',
			aliases: ['aww-anime', 'moe'],
			group: 'random-img',
			memberName: 'awwnime',
			description: 'Responds with cute random anime art.',
			clientPermissions: ['EMBED_LINKS'],
			postType: 'image',
			getIcon: true,
			subreddit: 'awwnime'
		});
	}

	generateText(post, subreddit, icon) {
		return this.makeEmbed(post, subreddit, icon);
	}
};
