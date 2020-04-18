const Command = require('../../structures/Command');
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
			group: 'search',
			memberName: 'anime-airing',
			description: 'Responds with a list of the anime that air today.',
			clientPermissions: ['EMBED_LINKS'],
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
		try {
			const anime = await this.getList();
			if (!anime) return msg.say('No anime air today...');
			return msg.say(stripIndents`
				**Anime Airing on ${moment().tz('Asia/Tokyo').format('dddd, MMMM Do, YYYY')}**
				${anime.map(ani => {
					const title = ani.media.title.english || ani.media.title.romaji;
					const airingAt = moment(ani.airingAt * 1000).tz('Asia/Tokyo').format('h:mm A');
					return `• ${title} (@${airingAt} JST)`
				}).join('\n')}
			`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async getList() {
		const { body } = await request
			.post('https://graphql.anilist.co/')
			.send({
				variables: {
					greater: Number.parseInt(today().getTime() / 1000, 10),
					lower: Number.parseInt(tomorrow().getTime() / 1000, 10)
				},
				query: airingGraphQL
			});
		if (!body.data.anime.results.length) return null;
		return body.data.anime.results;
	}
};
