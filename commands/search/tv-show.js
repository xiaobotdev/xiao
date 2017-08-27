const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { shorten } = require('../../structures/Util');
const { TMDB_KEY } = process.env;

module.exports = class TVShowCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tv-show',
			aliases: ['tmdb-tv-show', 'tv', 'tmdb-tv'],
			group: 'search',
			memberName: 'tv-show',
			description: 'Searches TMDB for your query, getting TV show results.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What TV show would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		const { query } = args;
		try {
			const search = await snekfetch
				.get('http://api.themoviedb.org/3/search/tv')
				.query({
					api_key: TMDB_KEY,
					include_adult: msg.channel.nsfw || false,
					query
				});
			if (!search.body.results.length) return msg.say('Could not find any results.');
			const { body } = await snekfetch
				.get(`https://api.themoviedb.org/3/tv/${search.body.results[0].id}`)
				.query({ api_key: TMDB_KEY });
			const embed = new MessageEmbed()
				.setColor(0x00D474)
				.setTitle(body.name)
				.setURL(`https://www.themoviedb.org/tv/${body.id}`)
				.setAuthor('TMDB', 'https://i.imgur.com/G9q4DF1.png')
				.setDescription(body.overview ? shorten(body.overview) : 'No description available.')
				.setThumbnail(body.poster_path ? `https://image.tmdb.org/t/p/w500${body.poster_path}` : null)
				.addField('❯ First Air Date',
					body.first_air_date || 'N/A', true)
				.addField('❯ Last Air Date',
					body.last_air_date || 'N/A', true)
				.addField('❯ Seasons',
					body.number_of_seasons || 'N/A', true)
				.addField('❯ Episodes',
					body.number_of_episodes || 'N/A', true)
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
