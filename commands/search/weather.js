const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { OWM_KEY } = process.env;

module.exports = class WeatherCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'weather',
			aliases: ['open-weather-map'],
			group: 'search',
			memberName: 'weather',
			description: 'Responds with weather information for a specific location.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'location',
					prompt: 'What location would you like to get the weather of?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { location }) {
		try {
			const { body } = await snekfetch
				.get('http://api.openweathermap.org/data/2.5/weather')
				.query({
					q: location,
					units: 'metric',
					appid: OWM_KEY
				});
			const embed = new MessageEmbed()
				.setColor(0xFF7A09)
				.setAuthor('OpenWeatherMap', 'https://i.imgur.com/tUd1MYB.png')
				.setURL(`https://openweathermap.org/city/${body.id}`)
				.setThumbnail(body.weather[0].icon ? `http://openweathermap.org/img/w/${body.weather[0].icon}.png` : null)
				.setTimestamp()
				.addField('❯ City',
					body.name, true)
				.addField('❯ Country',
					body.sys.country, true)
				.addField('❯ Condition',
					body.weather.map(cond => `${cond.main} (${cond.description})`).join('\n'), true)
				.addField('❯ Temperature',
					body.main.temp ? `${body.main.temp}°C` : '???', true)
				.addField('❯ Humidity',
					body.main.humidity ? `${body.main.humidity}%` : '???', true)
				.addField('❯ Pressure',
					body.main.pressure ? `${body.main.pressure} hPa` : '???', true)
				.addField('❯ Visibility',
					body.visibility ? `${body.visibility}m` : '???', true)
				.addField('❯ Cloudiness',
					body.clouds && body.clouds.all ? `${body.clouds.all}%` : '???', true)
				.addField('❯ Wind Direction',
					body.wind && body.wind.deg ? `${body.wind.deg}°` : '???', true)
				.addField('❯ Wind Speed',
					body.wind && body.wind.speed ? `${body.wind.speed}m/s` : '???', true);
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
