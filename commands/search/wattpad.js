const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { shorten } = require('../../structures/Util');
const { WATTPAD_KEY } = process.env;

module.exports = class WattpadCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'wattpad',
			aliases: ['wattpad-book'],
			group: 'search',
			memberName: 'wattpad',
			description: 'Searches Wattpad for your query.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What book would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await snekfetch
				.get('https://api.wattpad.com/v4/stories')
				.query({
					query,
					limit: 1
				})
				.set({ Authorization: `Basic ${WATTPAD_KEY}` });
			if (!body.stories.length) return msg.say('Could not find any results.');
			const data = body.stories[0];
			const embed = new MessageEmbed()
				.setColor(0xF89C34)
				.setAuthor('Wattpad', 'https://i.imgur.com/lFTXnlz.png')
				.setURL(data.url)
				.setTitle(data.title)
				.setDescription(shorten(data.description))
				.setThumbnail(data.cover)
				.addField('❯ Created On',
					new Date(data.createDate).toDateString(), true)
				.addField('❯ Author',
					data.user, true)
				.addField('❯ Parts',
					data.numParts, true)
				.addField('❯ Reads',
					data.readCount, true)
				.addField('❯ Votes',
					data.voteCount, true)
				.addField('❯ Comments',
					data.commentCount, true);
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
