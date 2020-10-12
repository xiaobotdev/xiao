const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const cheerio = require('cheerio');
const { stripIndents } = require('common-tags');
const { cleanHTML, embedURL } = require('../../util/Util');
const ANILIST_USERNAME = process.env.ANILIST_USERNAME || 'dragonfire535';
const searchGraphQL = stripIndents`
	query ($search: String, $type: MediaType, $isAdult: Boolean) {
		anime: Page (perPage: 10) {
			results: media (type: $type, isAdult: $isAdult, search: $search) {
				id
				title {
					english
					romaji
				}
			}
		}
	}
`;
const resultGraphQL = stripIndents`
	query media($id: Int, $type: MediaType) {
		Media(id: $id, type: $type) {
			id
			idMal
			title {
				english
				romaji
			}
			coverImage {
				large
				medium
			}
			startDate { year }
			description(asHtml: false)
			siteUrl
			type
			status
			volumes
			chapters
			isAdult
			meanScore
			averageScore
			externalLinks {
				url
				site
			}
		}
	}
`;
const personalGraphQL = stripIndents`
	query ($name: String, $type: MediaType) {
		MediaListCollection(userName: $name, type: $type) {
			lists {
				entries {
					mediaId
					score(format: POINT_10)
					status
				}
				name
			}
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
			aliases: ['anilist-manga', 'light-novel', 'ln', 'anilist-light-novel', 'anilist-ln'],
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
				},
				{
					name: 'MyAnimeList',
					url: 'https://myanimelist.net/',
					reason: 'Score Data'
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

		this.personalList = null;
	}

	async run(msg, { query }) {
		try {
			const id = await this.search(query);
			if (!id) return msg.say('Could not find any results.');
			const manga = await this.fetchManga(id);
			if (!this.personalList) await this.fetchPersonalList();
			const entry = this.personalList.find(ma => ma.mediaId === id);
			const malScore = await this.fetchMALScore(manga.idMal);
			const malURL = `https://myanimelist.net/manga/${manga.idMal}`;
			const embed = new MessageEmbed()
				.setColor(0x02A9FF)
				.setAuthor('AniList', 'https://i.imgur.com/iUIRC7v.png', 'https://anilist.co/')
				.setURL(manga.siteUrl)
				.setThumbnail(manga.coverImage.large || manga.coverImage.medium || null)
				.setTitle(manga.title.english || manga.title.romaji)
				.setDescription(manga.description ? cleanHTML(manga.description) : 'No description.')
				.addField('❯ Status', statuses[manga.status], true)
				.addField('❯ Chapters / Volumes', `${manga.chapters || '???'}/${manga.volumes || '???'}`, true)
				.addField('❯ Year', manga.startDate.year || '???', true)
				.addField('❯ Average Score', manga.averageScore ? `${manga.averageScore}%` : '???', true)
				.addField(`❯ MAL Score`, malScore ? embedURL(malScore, malURL) : '???', true)
				.addField(`❯ ${ANILIST_USERNAME}'s Score`, entry && entry.score ? `${entry.score}/10` : '???', true)
				.addField('❯ External Links', manga.externalLinks.length
					? manga.externalLinks.map(link => `[${link.site}](${link.url})`).join(', ')
					: 'None');
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

	async fetchManga(id) {
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

	async fetchMALScore(id) {
		try {
			const { text } = await request.get(`https://myanimelist.net/manga/${id}`);
			const $ = cheerio.load(text);
			return $('span[itemprop="ratingValue"]').first().text();
		} catch {
			return null;
		}
	}

	async fetchPersonalList() {
		if (this.personalList) return this.personalList;
		const { body } = await request
			.post('https://graphql.anilist.co/')
			.send({
				variables: {
					name: ANILIST_USERNAME,
					type: 'MANGA'
				},
				query: personalGraphQL
			});
		const { lists } = body.data.MediaListCollection;
		this.personalList = [];
		for (const list of Object.values(lists)) this.personalList.push(...list.entries);
		setTimeout(() => { this.personalList = null; }, 3.6e+6);
		return this.personalList;
	}
};
