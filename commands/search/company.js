const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { CLEARBIT_KEY } = process.env;

module.exports = class CompanyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'company',
			aliases: ['clearbit', 'logo', 'company-logo'],
			group: 'search',
			memberName: 'company',
			description: 'Responds with the name and logo of a company.',
			credit: [
				{
					name: 'Clearbit',
					url: 'https://clearbit.com/',
					reason: 'Autocomplete API',
					reasonURL: 'https://dashboard.clearbit.com/docs#autocomplete-api'
				}
			],
			args: [
				{
					key: 'query',
					prompt: 'What company would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await request
				.get(`https://autocomplete.clearbit.com/v1/companies/suggest`)
				.query({ query })
				.set({ Authorization: `Bearer ${CLEARBIT_KEY}` });
			if (!body.length) return msg.say('Could not find any results.');
			const data = body[0];
			const embed = new MessageEmbed()
				.setTitle(data.name)
				.setImage(data.logo)
				.setFooter('Logos provided by Clearbit')
				.setURL('https://clearbit.com/')
				.setColor(0x00AE86);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
