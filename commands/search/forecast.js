const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');

module.exports = class ForecastCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'forecast',
			aliases: ['yahoo-forecast', 'weather-forecast', 'yahoo-weather-forecast'],
			group: 'search',
			memberName: 'forecast',
			description: 'Responds with the seven-day forecast for a specific location.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'location',
					prompt: 'What location would you like to get the forecast for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { location }) {
		try {
			const { body } = await request
				.get('https://query.yahooapis.com/v1/public/yql')
				.query({
					// eslint-disable-next-line max-len
					q: `select * from weather.forecast where u='f' AND woeid in (select woeid from geo.places(1) where text="${location}")`,
					format: 'json'
				});
			if (!body.query.count) return msg.say('Could not find any results.');
			const data = body.query.results.channel;
			const embed = new MessageEmbed()
				.setColor(0x0000FF)
				.setAuthor(data.title, 'https://i.imgur.com/IYF2Pfa.jpg', 'https://www.yahoo.com/news/weather')
				.setURL(data.link)
				.setTimestamp();
			for (let i = 0; i < 7; i++) {
				const forecast = data.item.forecast[i];
				embed.addField(`❯ ${forecast.day} - ${forecast.date}`, stripIndents`
					**High:** ${forecast.high}°F
					**Low:** ${forecast.low}°F
					**Condition:** ${forecast.text}
				`);
			}
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
