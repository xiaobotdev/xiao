const Command = require('../../framework/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const UserAgent = require('user-agents');
const { shorten } = require('../../util/Util');

module.exports = class RottenTomatoesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rotten-tomatoes',
			aliases: ['tomato-meter', 'r-tomatoes'],
			group: 'search',
			memberName: 'rotten-tomatoes',
			description: 'Searches Rotten Tomatoes for your query.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Rotten Tomatoes',
					url: 'https://www.rottentomatoes.com/',
					reason: 'API'
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
			const id = await this.search(query);
			if (!id) return msg.say('Could not find any results.');
			const data = await this.fetchMovie(id);
			const criticScore = data.ratingSummary.allCritics;
			const audienceScore = data.ratingSummary.audience;
			const embed = new MessageEmbed()
				.setColor(0xFFEC02)
				.setTitle(`${data.title} (${data.year})`)
				.setURL(`https://www.rottentomatoes.com${data.url}`)
				.setAuthor('Rotten Tomatoes', 'https://i.imgur.com/Sru8mZ3.jpg', 'https://www.rottentomatoes.com/')
				.setDescription(shorten(data.ratingSummary.consensus))
				.setThumbnail(data.posters.original)
				.addField('❯ Critic Score', criticScore.meterValue ? `${criticScore.meterValue}%` : '???', true)
				.addField('❯ Audience Score', audienceScore.meterScore ? `${audienceScore.meterScore}%` : '???', true);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async search(query) {
		const { body } = await request
			.get('https://www.rottentomatoes.com/api/private/v2.0/search/')
			.query({
				limit: 10,
				q: query
			})
			.set({ 'User-Agent': new UserAgent().toString() });
		if (!body.movies.length) return null;
		const find = body.movies.find(m => m.name.toLowerCase() === query.toLowerCase()) || body.movies[0];
		return find.url.replace('/m/', '');
	}

	async fetchMovie(id) {
		const { text } = await request
			.get(`https://www.rottentomatoes.com/api/private/v1.0/movies/${id}`)
			.set({ 'User-Agent': new UserAgent().toString() });
		return JSON.parse(text);
	}
};
