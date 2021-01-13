const Command = require('../../structures/Command');
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
			clientPermissions: ['EMBED_LINKS'],
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
					prompt: 'What user would you like to get the information of?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const data = await this.search(query);
			if (!data || !data.id || !data.name) return msg.say('Could not find any results.');
			return msg.say(`<https://anilist.co/user/${data.name}>`, {
				files: [{ attachment: `https://img.anili.st/user/${data.id}`, name: 'anilist.png' }]
			});
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
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
