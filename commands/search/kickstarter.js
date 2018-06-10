const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { shorten } = require('../../util/Util');

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
				.addField('❯ Goal', `$${data.goal}`, true)
				.addField('❯ Pledged', `$${data.pledged}`, true)
				.addField('❯ Backers', data.backers_count, true)
				.addField('❯ Creator', data.creator.name, true)
				.addField('❯ Creation Date', new Date(data.created_at * 1000).toDateString(), true)
				.addField('❯ Deadline', new Date(data.deadline * 1000).toDateString(), true);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
