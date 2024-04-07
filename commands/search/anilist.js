const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const searchGraphQL = stripIndents`
	query ($name: String) {
		users: Page (perPage: 1) {
			results: users (name: $name) {
				id
				name
			}
		}
	}
`;

module.exports = class AnilistCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'anilist',
			aliases: ['anilist-user'],
			group: 'search',
			memberName: 'anilist',
			description: 'Responds with user information for an Anilist user.',
			clientPermissions: [PermissionFlagsBits.EmbedLinks],
			credit: [
				{
					name: 'AniList',
					url: 'https://anilist.co/',
					reason: 'API',
					reasonURL: 'https://anilist.gitbook.io/anilist-apiv2-docs/'
				}
			],
			args: [
				{
					key: 'query',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		const data = await this.search(query);
		if (!data || !data.id || !data.name) return msg.say('Could not find any results.');
		return msg.say(`<https://anilist.co/user/${data.name}>`, {
			files: [{ attachment: `https://img.anili.st/user/${data.id}`, name: 'anilist.png' }]
		});
	}

	async search(query) {
		const { body } = await request
			.post('https://graphql.anilist.co/')
			.send({
				variables: { name: query },
				query: searchGraphQL
			});
		if (!body.data.users.results.length) return null;
		return body.data.users.results[0];
	}
};
