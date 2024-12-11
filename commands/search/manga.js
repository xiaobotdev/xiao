const Command = require('../../framework/Command');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const request = require('node-superfetch');
const cheerio = require('cheerio');
const { stripIndents } = require('common-tags');
const { cleanAnilistHTML, embedURL } = require('../../util/Util');
const logos = require('../../assets/json/logos');
const ANILIST_USERNAME = process.env.ANILIST_USERNAME || 'lilyissillyyy';
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
			description: 'Searches AniList for your query, getting manga results.',
			clientPermissions: [PermissionFlagsBits.EmbedLinks],
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
					type: 'string'
				}
			]
		});

		this.personalList = null;
	}

	async run(msg, { query }) {
		const id = await this.search(query);
		if (!id) return msg.say('Could not find any results.');
		const manga = await this.fetchManga(id);
		if (!this.personalList) await this.fetchPersonalList();
		const entry = this.personalList.find(ma => ma.mediaId === id);
		const malScore = await this.fetchMALScore(manga.idMal);
		const malURL = `https://myanimelist.net/manga/${manga.idMal}`;
		const embed = new EmbedBuilder()
			.setColor(0x02A9FF)
			.setAuthor({ name: 'AniList', iconURL: logos.anilist, url: 'https://anilist.co/' })
			.setURL(manga.siteUrl)
			.setThumbnail(manga.coverImage.large || manga.coverImage.medium || null)
			.setTitle(manga.title.english || manga.title.romaji)
			.setDescription(manga.description ? cleanAnilistHTML(manga.description) : 'No description.')
			.addField('❯ Status', statuses[manga.status], true)
			.addField('❯ Chapters / Volumes', `${manga.chapters || '???'}/${manga.volumes || '???'}`, true)
			.addField('❯ Year', manga.startDate.year?.toString() || '???', true)
			.addField('❯ Average Score', manga.averageScore ? `${manga.averageScore}%` : '???', true)
			.addField(`❯ MAL Score`, malScore ? embedURL(malScore, malURL) : '???', true)
			.addField(`❯ ${ANILIST_USERNAME}'s Score`, entry && entry.score ? `${entry.score}/10` : '???', true)
			.addField('❯ External Links', manga.externalLinks.length
				? manga.externalLinks.map(link => embedURL(link.site, link.url)).join(', ')
				: 'None');
		return msg.embed(embed);
	}

	async search(query) {
		const { body } = await request
			.post('https://graphql.anilist.co/')
			.set({ referer: 'nick is dum dum' })
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
			.set({ referer: 'nick is dum dum' })
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
			.set({ referer: 'nick is dum dum' })
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
