const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { shorten } = require('../../util/Util');
const { NYTIMES_KEY } = process.env;

module.exports = class NewYorkTimesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'new-york-times',
			aliases: ['ny-times', 'new-york-times-article', 'ny-times-article'],
			group: 'random',
			memberName: 'new-york-times',
			description: 'Searches the New York Times for your query.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What do you want to search for articles about?',
					type: 'string',
					default: ''
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const fetch = request
				.get('https://api.nytimes.com/svc/search/v2/articlesearch.json')
				.query({
					'api-key': NYTIMES_KEY,
					sort: 'newest'
				});
			if (query) fetch.query({ q: query });
			const { body } = await fetch;
			if (!body.response.docs.length) return msg.say('Could not find any results');
			const data = body.response.docs[Math.floor(Math.random() * body.response.docs.length)];
			const embed = new MessageEmbed()
				.setColor(0xF6F6F6)
				.setAuthor('New York Times', 'https://i.imgur.com/ZbuTWwO.png', 'https://www.nytimes.com/')
				.setURL(data.web_url)
				.setTitle(data.headline.main)
				.setDescription(shorten(data.snippet))
				.addField('❯ Publish Date', new Date(data.pub_date).toDateString(), true);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
