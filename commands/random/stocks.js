const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const moment = require('moment');
const { ALPHA_VANTAGE_KEY } = process.env;

module.exports = class StocksCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'stocks',
			aliases: ['stock'],
			group: 'random',
			memberName: 'stocks',
			description: 'Responds with the stock information for the symbol you specify.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'symbol',
					prompt: 'What is the symbol you would like to get data for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		const { symbol } = args;
		const { body } = await snekfetch
			.get('https://www.alphavantage.co/query')
			.query({
				function: 'TIME_SERIES_INTRADAY',
				symbol,
				interval: '1min',
				apikey: ALPHA_VANTAGE_KEY
			});
		if (body['Error Message']) return msg.say('Invalid Symbol.');
		const data = body['Time Series (1min)'][Object.keys(body['Time Series (1min)'])[0]];
		const embed = new MessageEmbed()
			.setColor(0x0D0D0D)
			.setTitle(symbol.toUpperCase())
			.setTimestamp()
			.addField('❯ Open',
				`$${parseFloat(data['1. open'])}`, true)
			.addField('❯ Close',
				`$${parseFloat(data['4. close'])}`, true)
			.addField('❯ Volume',
				data['5. volume'], true)
			.addField('❯ High',
				`$${parseFloat(data['2. high'])}`, true)
			.addField('❯ Low',
				`$${parseFloat(data['3. low'])}`, true)
			.addField('❯ Last Updated',
				moment(Object.keys(body['Time Series (1min)'])[0]).format('MM-DD-YYYY hh:mm'), true);
		return msg.embed(embed);
	}
};
