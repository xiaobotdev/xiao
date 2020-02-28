const Command = require('../../structures/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { shorten, formatNumber, base64 } = require('../../util/Util');
const { GITHUB_USERNAME, GITHUB_PASSWORD } = process.env;

module.exports = class GithubCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'github',
			aliases: ['repo', 'gh'],
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
					prompt: 'Who is the author of the repository?',
					type: 'string',
					parse: author => encodeURIComponent(author)
				},
				{
					key: 'repository',
					prompt: 'What is the name of the repository?',
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
				.set({ Authorization: `Basic ${base64(`${GITHUB_USERNAME}:${GITHUB_PASSWORD}`)}` });
			const embed = new MessageEmbed()
				.setColor(0xFFFFFF)
				.setAuthor('GitHub', 'https://i.imgur.com/e4HunUm.png', 'https://github.com/')
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
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
