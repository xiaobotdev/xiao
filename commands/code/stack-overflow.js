const Command = require('../../framework/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { decode: decodeHTML } = require('html-entities');
const { formatNumber, embedURL } = require('../../util/Util');
const { STACKOVERFLOW_KEY } = process.env;

module.exports = class StackOverflowCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'stack-overflow',
			group: 'code',
			memberName: 'stack-overflow',
			description: 'Searches Stack Overflow for your query.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Stack Exchange',
					url: 'https://stackexchange.com/',
					reason: 'API',
					reasonURL: 'https://api.stackexchange.com/docs'
				}
			],
			args: [
				{
					key: 'query',
					prompt: 'What question would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await request
				.get('http://api.stackexchange.com/2.2/search/advanced')
				.query({
					page: 1,
					pagesize: 1,
					order: 'asc',
					sort: 'relevance',
					answers: 1,
					q: query,
					site: 'stackoverflow',
					key: STACKOVERFLOW_KEY
				});
			if (!body.items.length) return msg.say('Could not find any results.');
			const data = body.items[0];
			const embed = new MessageEmbed()
				.setColor(0xF48023)
				.setAuthor('Stack Overflow', 'https://i.imgur.com/P2jAgE3.png', 'https://stackoverflow.com/')
				.setURL(data.link)
				.setTitle(decodeHTML(data.title))
				.addField('❯ ID', data.question_id, true)
				.addField('❯ Asker', embedURL(data.owner.display_name, data.owner.link), true)
				.addField('❯ Views', formatNumber(data.view_count), true)
				.addField('❯ Score', formatNumber(data.score), true)
				.addField('❯ Creation Date', moment.utc(data.creation_date * 1000).format('MM/DD/YYYY h:mm A'), true)
				.addField('❯ Last Activity',
					moment.utc(data.last_activity_date * 1000).format('MM/DD/YYYY h:mm A'), true);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
