const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
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
					prompt: 'What would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		const { query } = args;
		const search = await snekfetch
			.get('http://api.themoviedb.org/3/search/tv')
			.query({
				api_key: TMDB_KEY,
				include_adult: msg.channel.nsfw ? true : false,
				query
			});
		if (!search.body.results.length) return msg.say('No Results.');
		const { body } = await snekfetch
			.get(`https://api.themoviedb.org/3/tv/${search.body.results[0].id}`)
			.query({ api_key: TMDB_KEY });
		const embed = new MessageEmbed()
			.setColor(0x00D474)
			.setTitle(body.name)
			.setURL(`https://www.themoviedb.org/tv/${body.id}`)
			.setAuthor('TMDB', 'https://i.imgur.com/G9q4DF1.png')
			.setDescription(body.overview.substr(0, 2048))
			.setThumbnail(body.poster_path ? `https://image.tmdb.org/t/p/w500${body.poster_path}` : null)
			.addField('❯ First Air Date',
				body.first_air_date, true)
			.addField('❯ Last Air Date',
				body.last_air_date, true)
			.addField('❯ Seasons',
				body.number_of_seasons, true)
			.addField('❯ Episodes',
				body.number_of_episodes, true)
			.addField('❯ Genres',
				body.genres.map(genre => genre.name).join(', '))
			.addField('❯ Production Companies',
				body.production_companies.length ? body.production_companies.map(company => company.name).join(', ') : 'N/A');
		return msg.embed(embed);
	}
};
