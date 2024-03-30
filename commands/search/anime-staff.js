const Command = require('../../framework/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const { embedURL, cleanAnilistHTML, trimArray } = require('../../util/Util');
const logos = require('../../assets/json/logos');
const searchGraphQL = stripIndents`
	query ($search: String) {
		staff: Page (perPage: 1) {
			results: staff (search: $search) { id }
		}
	}
`;
const resultGraphQL = stripIndents`
	query ($id: Int!) {
		Staff (id: $id) {
			id
			name {
				first
				last
			}
			image {
				large
				medium
			}
			description(asHtml: false)
			siteUrl
			characterMedia(page: 1, perPage: 25) {
				edges {
					node {
						title {
							english
							romaji
						}
						type
						siteUrl
					}
					characterRole
					staffRole
				}
			}
			staffMedia(page: 1, perPage: 25) {
				edges {
					node {
						title {
							english
							romaji
						}
						type
						siteUrl
					}
					staffRole
				}
			}
		}
	}
`;
const types = {
	ANIME: 'Anime',
	MANGA: 'Manga'
};
const roles = {
	MAIN: 'Main',
	SUPPORTING: 'Supporting',
	BACKGROUND: 'Background'
};

module.exports = class AnimeStaffCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'anime-staff',
			aliases: ['anilist-staff', 'staff', 'manga-staff', 'ani-staff'],
			group: 'search',
			memberName: 'anime-staff',
			description: 'Searches AniList for your query, getting staff results.',
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
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		const id = await this.search(query);
		if (!id) return msg.say('Could not find any results.');
		const staff = await this.fetchStaff(id);
		const embed = new MessageEmbed()
			.setColor(0x02A9FF)
			.setAuthor('AniList', logos.anilist, 'https://anilist.co/')
			.setURL(staff.siteUrl)
			.setThumbnail(staff.image.large || staff.image.medium || null)
			.setTitle(`${staff.name.first || ''}${staff.name.last ? ` ${staff.name.last}` : ''}`)
			.setDescription(staff.description ? cleanAnilistHTML(staff.description, false) : 'No description.')
			.addField('❯ Voice Roles',
				staff.characterMedia.edges.length ? trimArray(staff.characterMedia.edges.map(edge => {
					const title = edge.node.title.english || edge.node.title.romaji;
					return embedURL(`${title} (${roles[edge.characterRole]})`, edge.node.siteUrl);
				}), 5).join(', ') : 'None')
			.addField('❯ Production Roles',
				staff.staffMedia.edges.length ? trimArray(staff.staffMedia.edges.map(edge => {
					const title = edge.node.title.english || edge.node.title.romaji;
					return embedURL(`${title} (${types[edge.node.type]})`, edge.node.siteUrl);
				}), 5).join(', ') : 'None');
		return msg.embed(embed);
	}

	async search(query) {
		const { body } = await request
			.post('https://graphql.anilist.co/')
			.send({
				variables: { search: query },
				query: searchGraphQL
			});
		if (!body.data.staff.results.length) return null;
		return body.data.staff.results[0].id;
	}

	async fetchStaff(id) {
		const { body } = await request
			.post('https://graphql.anilist.co/')
			.send({
				variables: { id },
				query: resultGraphQL
			});
		return body.data.Staff;
	}
};
