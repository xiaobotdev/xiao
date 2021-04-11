const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { CLEARBIT_KEY } = process.env;
const dragonFireAliases = ['dragonfire535', 'dragon fire', 'dragonfire'];

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
			const data = await this.fetchCompany(query);
			if (!data) return msg.say('Could not find any results.');
			if (!msg.channel.nsfw && this.client.adultSiteList.includes(data.domain)) {
				return msg.reply('This site is NSFW.');
			}
			const embed = new MessageEmbed()
				.setTitle(data.name)
				.setImage(data.logo)
				.setFooter(data.dragonFire ? 'Logo by MissPeahen' : 'Logos provided by Clearbit')
				.setURL(data.domain ? `https://${data.domain}` : null)
				.setColor(0x00AE86);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchCompany(query) {
		if (dragonFireAliases.includes(query.toLowerCase())) {
			return {
				name: 'Dragon Fire',
				logo: 'https://i.imgur.com/tHxWaoA.png',
				domain: null,
				dragonFire: true
			};
		}
		const { body } = await request
			.get(`https://autocomplete.clearbit.com/v1/companies/suggest`)
			.query({ query })
			.set({ Authorization: `Bearer ${CLEARBIT_KEY}` });
		if (!body.length) return null;
		return body[0];
	}
};
