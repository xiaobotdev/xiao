const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { shorten } = require('../../structures/Util');
const { TMDB_KEY } = process.env;

module.exports = class MovieCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'movie',
			aliases: ['tmdb-movie'],
			group: 'search',
			memberName: 'movie',
			description: 'Searches TMDB for your query, getting movie results.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What movie would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		const { query } = args;
		try {
			const search = await snekfetch
				.get('http://api.themoviedb.org/3/search/movie')
				.query({
					api_key: TMDB_KEY,
					include_adult: msg.channel.nsfw || false,
					query
				});
			if (!search.body.results.length) return msg.say('Could not find any results.');
			const { body } = await snekfetch
				.get(`https://api.themoviedb.org/3/movie/${search.body.results[0].id}`)
				.query({ api_key: TMDB_KEY });
			const embed = new MessageEmbed()
				.setColor(0x00D474)
				.setTitle(body.title)
				.setURL(`https://www.themoviedb.org/movie/${body.id}`)
				.setAuthor('TMDB', 'https://i.imgur.com/G9q4DF1.png')
				.setDescription(body.overview ? shorten(body.overview) : 'No description available.')
				.setThumbnail(body.poster_path ? `https://image.tmdb.org/t/p/w500${body.poster_path}` : null)
				.addField('❯ Runtime',
					body.runtime ? `${body.runtime} mins.` : 'N/A', true)
				.addField('❯ Release Date',
					body.release_date || 'N/A', true)
				.addField('❯ Genres',
					body.genres.length ? body.genres.map(genre => genre.name).join(', ') : 'N/A')
				.addField('❯ Production Companies',
					body.production_companies.length ? body.production_companies.map(c => c.name).join(', ') : 'N/A');
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
