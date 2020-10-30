const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { shorten, formatNumber, pickWhenMany } = require('../../util/Util');
const { TMDB_KEY } = process.env;

module.exports = class TvShowCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tv-show',
			aliases: ['tmdb-tv-show', 'tv', 'tmdb-tv'],
			group: 'search',
			memberName: 'tv-show',
			description: 'Searches TMDB for your query, getting TV show results.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'The Movie Database',
					url: 'https://www.themoviedb.org/',
					reason: 'API',
					reasonURL: 'https://www.themoviedb.org/documentation/api'
				}
			],
			args: [
				{
					key: 'query',
					prompt: 'What TV show would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const search = await request
				.get('http://api.themoviedb.org/3/search/tv')
				.query({
					api_key: TMDB_KEY,
					include_adult: msg.channel.nsfw || false,
					query
				});
			if (!search.body.results.length) return msg.say('Could not find any results.');
			let find = search.body.results.find(m => m.name.toLowerCase() === query.toLowerCase())
				|| search.body.results[0];
			if (search.body.results.length > 1) {
				const resultListFunc = (show, i) => `**${i + 1}.** ${show.name} (${show.first_air_date || 'TBA'})`;
				find = await pickWhenMany(msg, search.body.results, find, resultListFunc);
			}
			const { body } = await request
				.get(`https://api.themoviedb.org/3/tv/${find.id}`)
				.query({ api_key: TMDB_KEY });
			const embed = new MessageEmbed()
				.setColor(0x00D474)
				.setTitle(body.name)
				.setURL(`https://www.themoviedb.org/tv/${body.id}`)
				.setAuthor('TMDB', 'https://i.imgur.com/3K3QMv9.png', 'https://www.themoviedb.org/')
				.setDescription(body.overview ? shorten(body.overview) : 'No description available.')
				.setThumbnail(body.poster_path ? `https://image.tmdb.org/t/p/w500${body.poster_path}` : null)
				.addField('❯ First Air Date', body.first_air_date || '???', true)
				.addField('❯ Last Air Date', body.last_air_date || '???', true)
				.addField('❯ Seasons', body.number_of_seasons ? formatNumber(body.number_of_seasons) : '???', true)
				.addField('❯ Episodes', body.number_of_episodes ? formatNumber(body.number_of_episodes) : '???', true)
				.addField('❯ Genres', body.genres.length ? body.genres.map(genre => genre.name).join(', ') : '???')
				.addField('❯ Production Companies',
					body.production_companies.length ? body.production_companies.map(c => c.name).join(', ') : '???');
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
