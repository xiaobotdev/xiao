const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { shorten } = require('../../structures/Util');

module.exports = class DerpibooruCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'derpibooru',
			aliases: ['my-little-pony-image', 'mlp-image', 'derpibooru-image'],
			group: 'search',
			memberName: 'derpibooru',
			description: 'Searches Derpibooru for your query.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What image would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const search = await snekfetch
				.get('https://derpibooru.org/search.json')
				.query({
					q: query,
					random_image: 1
				});
			if (!search.body) return msg.say('Could not find any results.');
			const { body } = await snekfetch
				.get(`https://derpibooru.org/images/${search.body.id}.json`);
			if (!msg.channel.nsfw && body.tags.includes('suggestive')) {
				return msg.say('This image is only viewable in NSFW channels.');
			}
			const embed = new MessageEmbed()
				.setAuthor('Derpibooru', 'https://i.imgur.com/cptnecp.png')
				.setColor(0xC6D2E1)
				.setURL(`https://derpibooru.org/images/${body.id}`)
				.setImage(`https:${body.representations.medium}`)
				.addField('❯ Uploader',
					body.uploader, true)
				.addField('❯ Upload Date',
					new Date(body.created_at).toDateString(), true)
				.addField('❯ Tags',
					shorten(body.tags, 1000));
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
