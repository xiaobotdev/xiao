const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const moment = require('moment-timezone');
const { today, tomorrow } = require('../../util/Util');
const airingGraphQL = stripIndents`
	query AiringSchedule($greater: Int, $lower: Int) {
		anime: Page {
			results: airingSchedules(airingAt_greater: $greater, airingAt_lesser: $lower) {
				airingAt
				media {
					id
					title {
						english
						romaji
					}
				}
			}
		}
	}
`;

module.exports = class AnimeAiringCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'anime-airing',
			aliases: ['anichart', 'airing-anime', 'seasonal-anime', 'anime-seasonal'],
			group: 'events',
			memberName: 'anime-airing',
			description: 'Responds with a list of the anime that air today.',
			clientPermissions: [PermissionFlagsBits.EmbedLinks],
			credit: [
				{
					name: 'AniList',
					url: 'https://anilist.co/',
					reason: 'API',
					reasonURL: 'https://anilist.gitbook.io/anilist-apiv2-docs/'
				}
			]
		});
	}

	async run(msg) {
		const anime = await this.getList();
		if (!anime) return msg.say('No anime air today...');
		const mapped = anime.sort((a, b) => a.airingAt - b.airingAt).map(ani => {
			const title = ani.media.title.english || ani.media.title.romaji;
			const airingAt = moment(ani.airingAt * 1000).tz('Asia/Tokyo').format('h:mm A');
			return `• ${title} (@${airingAt} JST)`;
		});
		return msg.say(stripIndents`
			**Anime Airing on ${moment().tz('Asia/Tokyo').format('dddd, MMMM Do, YYYY')}**
			${mapped.join('\n')}
		`);
	}

	async getList() {
		const { body } = await request
			.post('https://graphql.anilist.co/')
			.send({
				variables: {
					greater: Number.parseInt(today(9).getTime() / 1000, 10),
					lower: Number.parseInt(tomorrow(9).getTime() / 1000, 10)
				},
				query: airingGraphQL
			});
		if (!body.data.anime.results.length) return null;
		return body.data.anime.results;
	}
};
