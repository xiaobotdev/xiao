const SubredditCommandBase = require('../../structures/commands/Subreddit');
const { MessageEmbed } = require('discord.js');
const { shorten, formatNumberK } = require('../../util/Util');

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
		const embed = new MessageEmbed()
			.setColor(0xFF4500)
			.setAuthor(`r/${subreddit}`, icon, `https://www.reddit.com/r/${subreddit}/`)
			.setTitle(shorten(post.title, 256))
			.setImage(post.post_hint === 'image' ? post.url : null)
			.setURL(`https://www.reddit.com${post.permalink}`)
			.setTimestamp(post.created_utc * 1000)
			.setFooter(`⬆ ${formatNumberK(post.score)}`);
		if (post.thumbnail && post.thumbnail !== 'self' && post.post_hint !== 'image') {
			embed.setThumbnail(post.thumbnail);
		}
		return embed;
	}
};
