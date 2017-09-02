const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class RedditCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reddit',
			group: 'search',
			memberName: 'reddit',
			description: 'Gets a random recent post from a subreddit.',
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

	async run(msg, args) {
		try {
			const { subreddit } = args;
			const { body } = await snekfetch
				.get(`https://www.reddit.com/r/${subreddit}/new.json`)
				.query({ sort: 'new' });
			if (!body.data.children.length) return msg.say('Could not find any results.');
			const post = body.data.children[Math.floor(Math.random() * body.data.children.length)].data;
			if (!msg.channel.nsfw && post.over_18) return msg.say('This post is only viewable in NSFW channels.');
			const embed = new MessageEmbed()
				.setColor(0xFF4500)
				.setAuthor('Reddit', 'https://i.imgur.com/V6hXniU.png')
				.setURL(`https://www.reddit.com${post.permalink}`)
				.setTitle(post.title)
				.setDescription(`[View URL Here](${post.url})`)
				.addField('❯ Upvotes',
					post.ups, true)
				.addField('❯ Downvotes',
					post.downs, true)
				.addField('❯ Score',
					post.score, true);
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 403) return msg.say('This subreddit is private.');
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
