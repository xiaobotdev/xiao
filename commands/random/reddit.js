const SubredditCommand = require('../../structures/commands/Subreddit');
const { MessageEmbed } = require('discord.js');
const { formatNumber } = require('../../util/Util');

module.exports = class RedditCommand extends SubredditCommand {
	constructor(client) {
		super(client, {
			name: 'reddit',
			aliases: ['subreddit', 'r', 'r/', 'sub'],
			group: 'random',
			memberName: 'reddit',
			description: 'Responds with a random post from a subreddit.',
			clientPermissions: ['EMBED_LINKS'],
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
		return new MessageEmbed()
			.setColor(0xFF4500)
			.setAuthor(`r/${subreddit}`, 'https://i.imgur.com/DSBOK0P.png', `https://www.reddit.com/r/${subreddit}/`)
			.setTitle(post.title)
			.setImage(post.post_hint === 'image' ? post.url : null)
			.setURL(`https://www.reddit.com${post.permalink}`)
			.setTimestamp(post.created_utc * 1000)
			.setFooter(`⬆ ${formatNumber(post.ups)}`);
	}
};
