const SubredditCommandBase = require('../../structures/commands/Subreddit');
const { MessageEmbed } = require('discord.js');
const { formatNumber } = require('../../util/Util');

module.exports = class SubredditCommand extends SubredditCommandBase {
	constructor(client) {
		super(client, {
			name: 'subreddit',
			aliases: ['r/', 'sub'],
			group: 'random',
			memberName: 'subreddit',
			description: 'Responds with a random post from a subreddit.',
			clientPermissions: ['EMBED_LINKS'],
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
		return new MessageEmbed()
			.setColor(0xFF4500)
			.setAuthor(`r/${subreddit}`, icon, `https://www.reddit.com/r/${subreddit}/`)
			.setTitle(post.title)
			.setImage(post.post_hint === 'image' ? post.url : null)
			.setURL(`https://www.reddit.com${post.permalink}`)
			.setTimestamp(post.created_utc * 1000)
			.setFooter(`⬆ ${formatNumber(post.ups)}`);
	}
};
