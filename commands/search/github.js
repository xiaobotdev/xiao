const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const moment = require('moment');
const { GITHUB_LOGIN } = process.env;

module.exports = class GitHubCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'github',
			group: 'search',
			memberName: 'github',
			description: 'Searches GitHub for information on a repository.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'author',
					prompt: 'Who is the author of the repository?',
					type: 'string'
				},
				{
					key: 'repository',
					prompt: 'What is the name of the repository?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		const { author, repository } = args;
		try {
			const { body } = await snekfetch
				.get(`https://${GITHUB_LOGIN}@api.github.com/repos/${author}/${repository}`);
			const embed = new MessageEmbed()
				.setColor(0xFFFFFF)
				.setAuthor('GitHub', 'https://i.imgur.com/bRROLzk.png')
				.setTitle(body.full_name)
				.setURL(body.html_url)
				.setDescription(body.description || 'No description.')
				.setThumbnail(body.owner.avatar_url || null)
				.addField('❯ Stars',
					body.stargazers_count, true)
				.addField('❯ Forks',
					body.forks, true)
				.addField('❯ Issues',
					body.open_issues, true)
				.addField('❯ Language',
					body.language || 'N/A', true)
				.addField('❯ Created',
					moment(body.created_at).format('MMMM Do YYYY'), true)
				.addField('❯ Modified',
					moment(body.updated_at).format('MMMM Do YYYY'), true);
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
