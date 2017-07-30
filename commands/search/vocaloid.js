const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const moment = require('moment');

module.exports = class VocaloidCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'vocaloid',
			aliases: ['vocadb'],
			group: 'search',
			memberName: 'vocaloid',
			description: 'Searches VocaDB for your query.',
			args: [
				{
					key: 'query',
					prompt: 'What song would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		const { query } = args;
		const { body } = await snekfetch
			.get('http://vocadb.net/api/songs')
			.query({
				query,
				maxResults: 1,
				getTotalCount: true,
				sort: 'FavoritedTimes',
				preferAccurateMatches: true,
				nameMatchMode: 'Exact'
			});
		if (!body.totalCount) return msg.say('No Results.');
		const embed = new MessageEmbed()
			.setAuthor(`VocaDB - ${body.items[0].name}`, 'https://i.imgur.com/MklQqa2.png')
			.setURL(`http://vocadb.net/S/${body.items[0].id}`)
			.addField('❯ Artist',
				body.items[0].artistString)
			.addField('❯ Publish Date',
				moment(body.items[0].publishDate).format('MMMM Do YYYY'), true)
			.addField('❯ Length',
				(body.items[0].lengthSeconds / 60).toFixed(2).replace(/\./g, ':'), true);
		return msg.embed(embed);
	}
};
