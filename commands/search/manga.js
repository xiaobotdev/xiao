const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const { cleanAnilistHTML } = require('../../util/Util');
const searchGraphQL = stripIndents`
	query ($search: String, $type: MediaType, $isAdult: Boolean) {
		anime: Page (perPage: 1) {
			results: media (type: $type, isAdult: $isAdult, search: $search) { id }
		}
	}
`;
const resultGraphQL = stripIndents`
	query media($id: Int, $type: MediaType) {
		Media(id: $id, type: $type) {
			id
			title {
				english
				userPreferred
			}
			coverImage { large }
			startDate { year }
			description(asHtml: false)
			siteUrl
			type
			status
			volumes
			chapters
			isAdult
			meanScore
		}
	}
`;
const statuses = {
	FINISHED: 'Finished',
	RELEASING: 'Releasing',
	NOT_YET_RELEASED: 'Unreleased',
	CANCELLED: 'Cancelled'
};

module.exports = class MangaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'manga',
			aliases: ['anilist-manga'],
			group: 'search',
			memberName: 'manga',
			description: 'Searches AniList for your query, getting manga results.',
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
					prompt: 'What manga would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const id = await this.search(query);
			if (!id) return msg.say('Could not find any results.');
			const manga = await this.fetchAnime(id);
			const embed = new MessageEmbed()
				.setColor(0x02A9FF)
				.setAuthor('AniList', 'https://i.imgur.com/iUIRC7v.png', 'https://anilist.co/')
				.setURL(manga.siteUrl)
				.setThumbnail(manga.coverImage.large || manga.coverImage.medium || null)
				.setTitle(manga.title.english || manga.title.userPreferred)
				.setDescription(manga.description ? cleanAnilistHTML(manga.description) : 'No description.')
				.addField('❯ Status', statuses[manga.status], true)
				.addField('❯ Chapters / Volumes', `${manga.chapters || '???'}/${manga.volumes || '???'}`, true)
				.addField('❯ Year', manga.startDate.year || '???', true)
				.addField('❯ Average Score', manga.meanScore ? `${manga.meanScore}/100` : '???', true);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async search(query) {
		const { body } = await request
			.post('https://graphql.anilist.co/')
			.send({
				variables: {
					search: query,
					type: 'MANGA'
				},
				query: searchGraphQL
			});
		if (!body.data.anime.results.length) return null;
		return body.data.anime.results[0].id;
	}

	async fetchAnime(id) {
		const { body } = await request
			.post('https://graphql.anilist.co/')
			.send({
				variables: {
					id,
					type: 'MANGA'
				},
				query: resultGraphQL
			});
		return body.data.Media;
	}
};
