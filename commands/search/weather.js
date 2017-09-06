const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { list } = require('../../structures/Util');
const { OWM_KEY } = process.env;
const types = ['zip', 'name'];

module.exports = class WeatherCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'weather',
			group: 'search',
			memberName: 'weather',
			description: 'Responds with weather information for a specified location.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'type',
					prompt: `What type should the search be? Either ${list(types, 'or')}.`,
					type: 'string',
					validate: type => {
						if (types.includes(type)) return true;
						return `Invalid type, please enter either ${list(types, 'or')}.`;
					},
					parse: type => type.toLowerCase()
				},
				{
					key: 'query',
					prompt: 'What location would you like to get the weather of?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		const { type, query } = args;
		try {
			const { body } = await snekfetch
				.get('http://api.openweathermap.org/data/2.5/weather')
				.query({
					q: type === 'name' ? query : '',
					zip: type === 'zip' ? query : '',
					units: 'metric',
					appid: OWM_KEY
				});
			const embed = new MessageEmbed()
				.setColor(0xFF7A09)
				.setAuthor('OpenWeatherMap', 'https://i.imgur.com/S5MHmeY.png')
				.setThumbnail(body.weather[0].icon ? `http://openweathermap.org/img/w/${body.weather[0].icon}.png` : null)
				.setTimestamp()
				.addField('❯ City',
					body.name, true)
				.addField('❯ Country',
					body.sys.country, true)
				.addField('❯ Condition',
					body.weather.map(cond => `${cond.main} (${cond.description})`).join('\n'), true)
				.addField('❯ Temperature',
					body.main.temp ? `${body.main.temp}°C` : 'N/A', true)
				.addField('❯ Humidity',
					body.main.humidity ? `${body.main.humidity}%` : 'N/A', true)
				.addField('❯ Pressure',
					body.main.pressure ? `${body.main.pressure} hPa` : 'N/A', true)
				.addField('❯ Visibility',
					body.visibility ? `${body.visibility}m` : 'N/A', true)
				.addField('❯ Cloudiness',
					body.clouds && body.clouds.all ? `${body.clouds.all}%` : 'N/A', true)
				.addField('❯ Wind Direction',
					body.wind && body.wind.deg ? `${body.wind.deg}°` : 'N/A', true)
				.addField('❯ Wind Speed',
					body.wind && body.wind.speed ? `${body.wind.speed}m/s` : 'N/A', true);
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
