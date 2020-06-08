const SubredditCommand = require('../../structures/commands/Subreddit');
const { MessageEmbed } = require('discord.js');
const { formatNumber } = require('../../util/Util');

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
