const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { shorten } = require('../../util/Util');

module.exports = class KhWikiCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kh-wiki',
			aliases: ['kingdom-hearts-wiki', 'kh-wiki-article', 'kingdom-hearts-wiki-article'],
			group: 'search',
			memberName: 'kh-wiki',
			description: 'Searches the Kingdom Hearts Wiki for your query.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What article would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await request
				.get('https://www.khwiki.com/api.php')
				.query({
					action: 'query',
					prop: 'extracts|pageimages',
					format: 'json',
					titles: query,
					exintro: '',
					explaintext: '',
					pithumbsize: 150,
					redirects: '',
					formatversion: 2
				});
			const data = body.query.pages[0];
			if (data.missing) return msg.say('Could not find any results.');
			const embed = new MessageEmbed()
				.setColor(0x0679BC)
				.setTitle(data.title)
				.setAuthor('Kingdom Hearts Wiki', 'https://i.imgur.com/OZhrA41.jpg', 'https://www.khwiki.com/')
				.setThumbnail(data.thumbnail ? data.thumbnail.source : null)
				.setURL(`https://www.khwiki.com/${encodeURIComponent(query).replace(/\)/g, '%29')}`)
				.setDescription(shorten(data.extract.replace(/.+\n\n/, '').replace(/\n/g, '\n\n')));
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
