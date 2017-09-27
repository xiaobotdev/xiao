const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class KickstarterCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kickstarter',
			aliases: ['kickstarter-project'],
			group: 'search',
			memberName: 'kickstarter',
			description: 'Searches Kickstarter for your query.',
			clientPermissions: ['EMBED_LINKS'],
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
			const { body } = await snekfetch
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
				.setAuthor('Kickstarter', 'https://i.imgur.com/EHDlH5t.png')
				.setDescription(data.blurb)
				.setThumbnail(data.photo ? data.photo.full : null)
				.addField('❯ Goal',
					`${data.currency_symbol}${data.goal.toLocaleString()}`, true)
				.addField('❯ Pledged',
					`${data.currency_symbol}${data.pledged.toLocaleString()}`, true)
				.addField('❯ Backers',
					data.backers_count, true)
				.addField('❯ Creator',
					data.creator.name, true);
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
