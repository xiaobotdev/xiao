const Command = require('../../framework/Command');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const logos = require('../../assets/json/logos');
const searchGraphQL = stripIndents`
	query ($page: Int, $type: MediaType) {
		Page (page: $page) {
			pageInfo {
				total
				lastPage
				perPage
			}
			media (type: $type, popularity_greater: 50000, isAdult: false, averageScore_not: 0, sort: POPULARITY_DESC) {
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
			game: true,
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

		this.totalAnime = null;
	}

	async run(msg) {
		const anime = await this.getRandomAnime();
		if (anime === 'ratelimited') {
			return msg.reply('Sorry, looks like the command needs to cool down. Try again later.');
		}
		const embed = new EmbedBuilder()
			.setColor(0x02A9FF)
			.setAuthor({ name: 'AniList', iconURL: logos.anilist, url: 'https://anilist.co/' })
			.setImage(anime.coverImage.large || anime.coverImage.medium || null)
			.setTitle(anime.title.english || anime.title.romaji)
			.setDescription(`_${anime.startDate.year}, ${formats[anime.format]}_`)
			.setFooter({ text: anime.id.toString() });
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
	}

	async getRandomAnime() {
		try {
			if (!this.totalAnime) await this.getTotalAnime();
			const selectedAnime = Math.floor(Math.random() * this.totalAnime);
			const { body } = await request
				.post('https://graphql.anilist.co/')
				.send({
					variables: {
						page: Math.ceil(selectedAnime / 50),
						type: 'ANIME'
					},
					query: searchGraphQL
				});
			const selected = body.data.Page.media[selectedAnime % 50];
			if (!selected) return this.getRandomAnime();
			return selected;
		} catch (err) {
			if (err.status === 429) return 'ratelimited';
			throw err;
		}
	}

	async getTotalAnime() {
		if (this.totalAnime) return this.totalAnime;
		const { body } = await request
			.post('https://graphql.anilist.co/')
			.send({
				variables: {
					page: 0,
					type: 'ANIME'
				},
				query: searchGraphQL
			});
		const pageInfo = body.data.Page.pageInfo;
		this.totalAnime = pageInfo.lastPage * pageInfo.perPage;
		setTimeout(() => { this.totalAnime = null; }, 2.16e+7);
		return this.totalAnime;
	}
};
