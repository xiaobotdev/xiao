const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { formatNumber } = require('../../util/Util');
const { ALPHA_VANTAGE_KEY } = process.env;

module.exports = class StocksCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'stocks',
			aliases: ['stock', 'alpha-vantage'],
			group: 'search',
			memberName: 'stocks',
			description: 'Responds with the current stocks for a company.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Alpha Vantage',
					url: 'https://www.alphavantage.co/',
					reason: 'API'
				},
				{
					name: 'Yahoo',
					url: 'https://www.yahoo.com/',
					reason: 'Finance API'
				}
			],
			args: [
				{
					key: 'query',
					prompt: 'What company would you like to get the stocks of?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const company = await this.search(query);
			if (!company) return msg.say('Could not find any results.');
			const { body } = await request
				.get('https://www.alphavantage.co/query')
				.query({
					function: 'TIME_SERIES_INTRADAY',
					symbol: company.symbol,
					interval: '1min',
					apikey: ALPHA_VANTAGE_KEY
				});
			if (body['Error Message']) return msg.say('Could not find any results.');
			const data = Object.values(body['Time Series (1min)'])[0];
			const embed = new MessageEmbed()
				.setTitle(`Stocks for ${company.name} (${company.symbol.toUpperCase()})`)
				.setColor(0x9797FF)
				.setFooter('Last Updated')
				.setTimestamp(new Date(body['Meta Data']['3. Last Refreshed']))
				.addField('❯ Open', `$${formatNumber(data['1. open'])}`, true)
				.addField('❯ Close', `$${formatNumber(data['4. close'])}`, true)
				.addField('❯ Volume', formatNumber(data['5. volume']), true)
				.addField('❯ High', `$${formatNumber(data['2. high'])}`, true)
				.addField('❯ Low', `$${formatNumber(data['3. low'])}`, true)
				.addField('\u200B', '\u200B', true);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async search(query) {
		const { body } = await request
			.get('http://d.yimg.com/autoc.finance.yahoo.com/autoc')
			.query({
				query,
				region: 1,
				lang: 'en'
			});
		if (!body.ResultSet.Result.length) return null;
		return body.ResultSet.Result[0];
	}
};
