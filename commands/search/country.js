const Command = require('../../framework/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { formatNumber } = require('../../util/Util');

module.exports = class CountryCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'country',
			group: 'search',
			memberName: 'country',
			description: 'Responds with information on a country.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Rest Countries',
					url: 'https://restcountries.eu/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'query',
					prompt: 'What country would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await request.get(`https://restcountries.eu/rest/v2/name/${encodeURIComponent(query)}`);
			const data = body.find(country => {
				const search = query.toLowerCase();
				return country.name.toLowerCase() === search
					|| country.altSpellings.some(alt => alt.toLowerCase() === search)
					|| country.alpha2Code.toLowerCase() === search
					|| country.alpha3Code.toLowerCase() === search
					|| country.nativeName.toLowerCase() === search;
			}) || body[0];
			const embed = new MessageEmbed()
				.setColor(0x00AE86)
				.setTitle(data.name)
				.setThumbnail(`https://www.countryflags.io/${data.alpha2Code}/flat/64.png`)
				.addField('❯ Population', formatNumber(data.population), true)
				.addField('❯ Capital', data.capital || 'None', true)
				.addField('❯ Currency', data.currencies[0].symbol, true)
				.addField('❯ Location', data.subregion || data.region, true)
				.addField('❯ Demonym', data.demonym || 'None', true)
				.addField('❯ Native Name', data.nativeName, true)
				.addField('❯ Area', `${formatNumber(data.area)}km`, true)
				.addField('❯ Languages', data.languages.map(lang => lang.name).join('/'));
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
