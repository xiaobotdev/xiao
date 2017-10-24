const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { shorten } = require('../../util/Util');
const { NYTIMES_KEY } = process.env;

module.exports = class NewYorkTimesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'new-york-times',
			aliases: ['ny-times', 'new-york-times-article', 'ny-times-article'],
			group: 'search',
			memberName: 'new-york-times',
			description: 'Responds with an article from the New York Times.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What do you want to search for articles about?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await snekfetch
				.get('https://api.nytimes.com/svc/search/v2/articlesearch.json')
				.query({
					q: query,
					'api-key': NYTIMES_KEY,
					sort: 'newest'
				});
			if (!body.response.docs.length) return msg.say('Could not find any results');
			const data = body.response.docs[Math.floor(Math.random() * body.response.docs.length)];
			const embed = new MessageEmbed()
				.setColor(0xF6F6F6)
				.setAuthor('New York Times', 'https://i.imgur.com/ZbuTWwO.png')
				.setURL(data.web_url)
				.setTitle(data.headline.main)
				.setDescription(shorten(data.snippet))
				.addField('❯ Publish Date',
					new Date(data.pub_date).toDateString(), true);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
