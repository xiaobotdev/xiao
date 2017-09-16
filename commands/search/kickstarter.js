const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class KickstarterCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kickstarter',
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
			const embed = new MessageEmbed()
				.setColor(0x14E06E)
				.setTitle(body.projects[0].name)
				.setURL(body.projects[0].urls.web.project)
				.setAuthor('Kickstarter', 'https://i.imgur.com/7mJF4qJ.png')
				.setDescription(body.projects[0].blurb)
				.setThumbnail(body.projects[0].photo ? body.projects[0].photo.full : null)
				.addField('❯ Goal',
					`${body.projects[0].currency_symbol}${body.projects[0].goal.toLocaleString()}`, true)
				.addField('❯ Pledged',
					`${body.projects[0].currency_symbol}${body.projects[0].pledged.toLocaleString()}`, true)
				.addField('❯ Backers',
					body.projects[0].backers_count, true)
				.addField('❯ Creator',
					body.projects[0].creator.name, true);
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
