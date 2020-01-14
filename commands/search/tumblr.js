const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { formatNumber } = require('../../util/Util');
const { TUMBLR_KEY } = process.env;

module.exports = class TumblrCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tumblr',
			group: 'search',
			memberName: 'tumblr',
			description: 'Responds with information on a Tumblr blog.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Tumblr',
					url: 'https://www.tumblr.com/',
					reason: 'API',
					reasonURL: 'https://www.tumblr.com/docs/en/api/v2'
				}
			],
			args: [
				{
					key: 'blog',
					prompt: 'What blog would you like to get information on?',
					type: 'string',
					parse: blog => encodeURIComponent(blog)
				}
			]
		});
	}

	async run(msg, { blog }) {
		try {
			const { body } = await request
				.get(`https://api.tumblr.com/v2/blog/${blog}/info`)
				.query({ api_key: TUMBLR_KEY });
			const data = body.response.blog;
			const embed = new MessageEmbed()
				.setColor(0x395976)
				.setAuthor('Tumblr', 'https://i.imgur.com/ouD9TUY.png', 'https://www.tumblr.com/')
				.setThumbnail(`https://api.tumblr.com/v2/blog/${blog}/avatar/512`)
				.setURL(data.url)
				.setTitle(data.title)
				.addField('❯ Posts', formatNumber(data.total_posts), true)
				.addField('❯ A.M.A.?', data.ask ? 'Yes' : 'No', true);
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
