const Command = require('../../framework/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { shorten, formatNumber } = require('../../util/Util');
const logos = require('../../assets/json/logos');
const { GITHUB_ACCESS_TOKEN } = process.env;

module.exports = class GithubCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'github',
			aliases: ['repo', 'gh', 'github-repo', 'gh-repo'],
			group: 'search',
			memberName: 'github',
			description: 'Responds with information on a GitHub repository.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'GitHub',
					url: 'https://github.com/',
					reason: 'API',
					reasonURL: 'https://developer.github.com/v3/'
				}
			],
			args: [
				{
					key: 'author',
					type: 'string',
					parse: author => encodeURIComponent(author)
				},
				{
					key: 'repository',
					type: 'string',
					parse: repository => encodeURIComponent(repository)
				}
			]
		});
	}

	async run(msg, { author, repository }) {
		try {
			const { body } = await request
				.get(`https://api.github.com/repos/${author}/${repository}`)
				.set({ Authorization: `token ${GITHUB_ACCESS_TOKEN}` });
			const embed = new MessageEmbed()
				.setColor(0xFFFFFF)
				.setAuthor('GitHub', logos.github, 'https://github.com/')
				.setTitle(body.full_name)
				.setURL(body.html_url)
				.setDescription(body.description ? shorten(body.description) : 'No description.')
				.setThumbnail(body.owner.avatar_url)
				.addField('❯ Stars', formatNumber(body.stargazers_count), true)
				.addField('❯ Forks', formatNumber(body.forks), true)
				.addField('❯ Issues', formatNumber(body.open_issues), true)
				.addField('❯ Language', body.language || '???', true)
				.addField('❯ Creation Date', moment.utc(body.created_at).format('MM/DD/YYYY h:mm A'), true)
				.addField('❯ Modification Date', moment.utc(body.updated_at).format('MM/DD/YYYY h:mm A'), true);
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			throw err;
		}
	}
};
