const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js');
const { formatNumber } = require('../../util/Util');

module.exports = class Covid19Command extends Command {
	constructor(client) {
		super(client, {
			name: 'covid-19',
			aliases: ['coronavirus', 'corona', 'covid'],
			group: 'events',
			memberName: 'covid-19',
			description: 'Responds with stats for COVID-19.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'disease.sh',
					url: 'https://disease.sh/',
					reason: 'COVID-19 API',
					reasonURL: 'https://disease.sh/docs/#/'
				}
			],
			args: [
				{
					key: 'country',
					prompt: 'What country do you want to get the stats for? Type `all` to get world stats.',
					type: 'string',
					default: 'all',
					parse: country => encodeURIComponent(country)
				}
			]
		});
	}

	async run(msg, { country }) {
		try {
			const data = await this.fetchStats(country);
			const slug = country === 'all' ? null : data.country === 'USA' ? 'us' : data.country.toLowerCase();
			const embed = new MessageEmbed()
				.setColor(0xA2D84E)
				.setAuthor('Worldometers', 'https://i.imgur.com/IoaBMuK.jpg', 'https://www.worldometers.info/coronavirus/')
				.setTitle(`Stats for ${country === 'all' ? 'The World' : data.country}`)
				.setURL(country === 'all'
					? 'https://www.worldometers.info/coronavirus/'
					: `https://www.worldometers.info/coronavirus/country/${encodeURIComponent(slug.replace(/ /g, '-'))}/`)
				.setThumbnail(country === 'all' ? null : data.countryInfo.flag || null)
				.setFooter('Last Updated')
				.setTimestamp(data.updated)
				.addField('❯ Total Cases', `${formatNumber(data.cases)} (${formatNumber(data.todayCases)} Today)`, true)
				.addField('❯ Total Deaths', `${formatNumber(data.deaths)} (${formatNumber(data.todayDeaths)} Today)`, true)
				.addField('❯ Total Recoveries',
					`${formatNumber(data.recovered)} (${formatNumber(data.todayRecovered)} Today)`, true)
				.addField('❯ Active Cases', formatNumber(data.active), true)
				.addField('❯ Active Critical Cases', formatNumber(data.critical), true)
				.addField('❯ Tests', formatNumber(data.tests), true);
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 404) return msg.say('Country not found or doesn\'t have any cases.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchStats(country) {
		const { body } = await request
			.get(`https://disease.sh/v3/covid-19/${country === 'all' ? 'all' : `countries/${country}`}`);
		return body;
	}
};
