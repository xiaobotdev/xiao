const SubredditCommand = require('../../structures/commands/Subreddit');
const { MessageEmbed } = require('discord.js');
const { list, formatNumber } = require('../../util/Util');
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
			clientPermissions: ['ATTACH_FILES'],
			nsfw: true,
			postType: 'image',
			getIcon: true,
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
