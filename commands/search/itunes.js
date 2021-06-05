const Command = require('../../framework/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');

module.exports = class ItunesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'itunes',
			group: 'search',
			memberName: 'itunes',
			description: 'Searches iTunes for your query.',
			details: '**Codes:** <https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes>',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Apple',
					url: 'https://www.apple.com/',
					reason: 'iTunes Search API',
					reasonURL: 'https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/'
				},
				{
					name: 'Wikipedia',
					url: 'https://www.wikipedia.org/',
					reasonURL: 'https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes',
					reason: 'Language Code Data'
				}
			],
			args: [
				{
					key: 'country',
					prompt: 'What country code should results be obtained for?',
					type: 'string',
					parse: country => country.toLowerCase()
				},
				{
					key: 'query',
					prompt: 'What song would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { country, query }) {
		try {
			const { text } = await request
				.get('https://itunes.apple.com/search')
				.query({
					term: query,
					media: 'music',
					entity: 'song',
					limit: 1,
					explicit: msg.channel.nsfw ? 'yes' : 'no',
					country
				});
			const body = JSON.parse(text);
			if (!body.results.length) return msg.say('Could not find any results.');
			const data = body.results[0];
			const embed = new MessageEmbed()
				.setColor(0xFEFEFE)
				.setAuthor('iTunes', 'https://i.imgur.com/PR29ow0.jpg', 'https://www.apple.com/itunes/')
				.setURL(data.trackViewUrl)
				.setThumbnail(data.artworkUrl100)
				.setTitle(data.trackName)
				.addField('❯ Artist', data.artistName, true)
				.addField('❯ Album', data.collectionName, true)
				.addField('❯ Release Date', moment.utc(data.releaseDate).format('MM/DD/YYYY'), true)
				.addField('❯ Genre', data.primaryGenreName, true);
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 400) {
				return msg.reply('Invalid country code. Refer to <https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes>.');
			}
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
