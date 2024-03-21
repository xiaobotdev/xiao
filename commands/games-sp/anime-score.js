const Command = require('../../framework/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const searchGraphQL = stripIndents`
	query ($page: Int, $type: MediaType, $isAdult: Boolean) {
		Page (page: $page) {
			pageInfo {
				total
			}
			media (type: $type, popularity_greater: 2500, averageScore_not: 0, isAdult: $isAdult) {
				id
				averageScore
				title {
					english
					romaji
				}
				coverImage {
					large
					medium
				}
				startDate { year }
				format
			}
		}
	}
`;
const formats = {
	TV: 'TV',
	TV_SHORT: 'TV Short',
	MOVIE: 'Movie',
	SPECIAL: 'Special',
	OVA: 'OVA',
	ONA: 'ONA',
	MUSIC: 'Music'
};

module.exports = class AnimeScoreCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'anime-score',
			aliases: ['guess-anime-score'],
			group: 'games-sp',
			memberName: 'anime-score',
			description: 'See if you can guess what a random anime\'s score is.',
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
			const anime = await this.getRandomAnime(msg.channel.nsfw);
			const embed = new MessageEmbed()
				.setColor(0x02A9FF)
				.setAuthor('AniList', 'https://i.imgur.com/iUIRC7v.png', 'https://anilist.co/')
				.setImage(anime.coverImage.large || anime.coverImage.medium || null)
				.setTitle(anime.title.english || anime.title.romaji)
				.setDescription(`_${anime.startDate.year}, ${formats[anime.format]}_`)
				.setFooter(anime.id.toString());
			await msg.reply('**You have 15 seconds, what score do you think this anime has?**', { embeds: [embed] });
			const filter = res => {
				if (res.author.id !== msg.author.id) return false;
				return Boolean(Number.parseInt(res.content, 10));
			};
			const msgs = await msg.channel.awaitMessages({
				filter,
				max: 1,
				time: 15000
			});
			if (!msgs.size) return msg.reply(`Sorry, time is up! It was **${anime.averageScore}%**.`);
			const ans = Number.parseInt(msgs.first().content, 10);
			const close = Math.abs(ans - anime.averageScore);
			if (close <= 10 && close !== 0) return msg.reply(`Close! It was **${anime.averageScore}%**.`);
			if (ans !== anime.averageScore) return msg.reply(`Nope, sorry, it was **${anime.averageScore}%**.`);
			return msg.reply(`Nice job! It was **${anime.averageScore}%**!`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async getRandomAnime(nsfw) {
		const { body: initialBody } = await request
			.post('https://graphql.anilist.co/')
			.send({
				variables: {
					page: 0,
					type: 'ANIME',
					isAdult: Boolean(nsfw)
				},
				query: searchGraphQL
			});
		const selectedAnime = Math.floor(Math.random() * initialBody.data.Page.pageInfo.total);
		const { body } = await request
			.post('https://graphql.anilist.co/')
			.send({
				variables: {
					page: Math.ceil(selectedAnime / 50),
					type: 'ANIME',
					isAdult: Boolean(nsfw)
				},
				query: searchGraphQL
			});
		return body.data.Page.media[selectedAnime % 50];
	}
};
