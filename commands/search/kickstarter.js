const Command = require('../../framework/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { shorten, formatNumber } = require('../../util/Util');

module.exports = class KickstarterCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kickstarter',
			group: 'search',
			memberName: 'kickstarter',
			description: 'Searches Kickstarter for your query.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Kickstarter',
					url: 'https://www.kickstarter.com/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'query',
					prompt: 'What project would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await request
				.get('https://www.kickstarter.com/projects/search.json')
				.query({
					search: '',
					term: query
				});
			if (!body.projects.length) return msg.say('Could not find any results.');
			const data = body.projects[0];
			const embed = new MessageEmbed()
				.setColor(0x14E06E)
				.setTitle(data.name)
				.setURL(data.urls.web.project)
				.setAuthor('Kickstarter', 'https://i.imgur.com/EHDlH5t.png', 'https://www.kickstarter.com/')
				.setDescription(shorten(data.blurb))
				.setThumbnail(data.photo ? data.photo.full : null)
				.addField('❯ Goal', `$${formatNumber(data.goal)}`, true)
				.addField('❯ Pledged', `$${formatNumber(data.pledged)}`, true)
				.addField('❯ Backers', formatNumber(data.backers_count), true)
				.addField('❯ Creator', data.creator.name, true)
				.addField('❯ Creation Date', moment.utc(data.created_at * 1000).format('MM/DD/YYYY h:mm A'), true)
				.addField('❯ Deadline', moment.utc(data.deadline * 1000).format('MM/DD/YYYY h:mm A'), true);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
