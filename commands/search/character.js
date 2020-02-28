const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const { cleanAnilistHTML } = require('../../util/Util');
const searchGraphQL = stripIndents`
	query ($search: String) {
		characters: Page (perPage: 1) {
			results: characters (search: $search) { id }
		}
	}
`;
const resultGraphQL = stripIndents`
	query ($id: Int!) {
		Character (id: $id) {
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
			media(page: 1, perPage: 10) {
				edges {
					node {
						title {
							english
							userPreferred
						}
						type
						siteUrl
					}
				}
			}
		}
	}
`;
const types = {
	ANIME: 'Anime',
	MANGA: 'Manga'
};

module.exports = class CharacterCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'character',
			aliases: ['anilist-character', 'anime-character', 'manga-character', 'manga-char', 'ani-char', 'char'],
			group: 'search',
			memberName: 'character',
			description: 'Searches AniList for your query, getting character results.',
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
					prompt: 'What character would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const id = await this.search(query);
			if (!id) return msg.say('Could not find any results.');
			const character = await this.fetchCharacter(id);
			const embed = new MessageEmbed()
				.setColor(0x02A9FF)
				.setAuthor('AniList', 'https://i.imgur.com/iUIRC7v.png', 'https://anilist.co/')
				.setURL(character.siteUrl)
				.setThumbnail(character.image.large || character.image.medium || null)
				.setTitle(`${character.name.first || ''}${character.name.last ? ` ${character.name.last}` : ''}`)
				.setDescription(character.description ? cleanAnilistHTML(character.description) : 'No description.')
				.addField('❯ Appearances', character.media.edges.map(edge => {
					const title = edge.node.title.english || edge.node.title.userPreferred;
					return `[${title} (${types[edge.node.type]})](${edge.node.siteUrl})`;
				}).join(', '));
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async search(query) {
		const { body } = await request
			.post('https://graphql.anilist.co/')
			.send({
				variables: { search: query },
				query: searchGraphQL
			});
		if (!body.data.characters.results.length) return null;
		return body.data.characters.results[0].id;
	}

	async fetchCharacter(id) {
		const { body } = await request
			.post('https://graphql.anilist.co/')
			.send({
				variables: { id },
				query: resultGraphQL
			});
		return body.data.Character;
	}
};
