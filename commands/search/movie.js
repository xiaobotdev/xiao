const Command = require('../../framework/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { shorten, pickWhenMany } = require('../../util/Util');
const { TMDB_KEY } = process.env;

module.exports = class MovieCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'movie',
			aliases: ['tmdb-movie', 'imdb'],
			group: 'search',
			memberName: 'movie',
			description: 'Searches TMDB for your query, getting movie results.',
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
					prompt: 'What movie would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const search = await request
				.get('http://api.themoviedb.org/3/search/movie')
				.query({
					api_key: TMDB_KEY,
					include_adult: msg.channel.nsfw || false,
					query
				});
			if (!search.body.results.length) return msg.say('Could not find any results.');
			let find = search.body.results.find(m => m.title.toLowerCase() === query.toLowerCase())
				|| search.body.results[0];
			if (search.body.results.length > 1) {
				const resultListFunc = (movie, i) => `**${i + 1}.** ${movie.title} (${movie.release_date || 'TBA'})`;
				find = await pickWhenMany(msg, search.body.results, find, resultListFunc);
			}
			const { body } = await request
				.get(`https://api.themoviedb.org/3/movie/${find.id}`)
				.query({ api_key: TMDB_KEY });
			const embed = new MessageEmbed()
				.setColor(0x00D474)
				.setTitle(body.title)
				.setURL(`https://www.themoviedb.org/movie/${body.id}`)
				.setAuthor('TMDB', 'https://i.imgur.com/3K3QMv9.png', 'https://www.themoviedb.org/')
				.setDescription(body.overview ? shorten(body.overview) : 'No description available.')
				.setThumbnail(body.poster_path ? `https://image.tmdb.org/t/p/w500${body.poster_path}` : null)
				.addField('❯ Runtime', body.runtime ? `${body.runtime} mins.` : '???', true)
				.addField('❯ Release Date', body.release_date || '???', true)
				.addField('❯ Genres', body.genres.length ? body.genres.map(genre => genre.name).join(', ') : '???')
				.addField('❯ Production Companies',
					body.production_companies.length ? body.production_companies.map(c => c.name).join(', ') : '???');
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
