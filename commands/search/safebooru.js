const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { xml2js } = require('xml-js');
const { shorten } = require('../../structures/Util');
const ratings = {
	s: 'Safe',
	q: 'Questionable'
};

module.exports = class SafebooruCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'safebooru',
			aliases: ['safebooru-image'],
			group: 'search',
			memberName: 'safebooru',
			description: 'Searches Safebooru for your query.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What image would you like to search for?',
					type: 'string',
					default: ''
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { text } = await snekfetch
				.get('https://safebooru.org/index.php')
				.query({
					page: 'dapi',
					s: 'post',
					q: 'index',
					tags: query
				});
			const parsed = xml2js(text, { compact: true }).posts;
			if (parsed._attributes.count === '0' || !parsed.post.length) return msg.say('Could not find any results.');
			const posts = msg.channel.nsfw ? parsed.post : parsed.post.filter(post => post._attributes.rating === 's');
			if (!posts.length) return msg.say('Could not find any results.');
			const data = posts[Math.floor(Math.random() * posts.length)]._attributes;
			const embed = new MessageEmbed()
				.setAuthor('Safebooru', 'https://i.imgur.com/iGMNwhf.jpg')
				.setColor(0xC6D2E1)
				.setURL(`http://safebooru.org/index.php?page=post&s=view&id=${data.id}`)
				.setImage(`https:${data.file_url}`)
				.addField('❯ Upload Date',
					new Date(data.created_at).toDateString(), true)
				.addField('❯ Rating',
					ratings[data.rating], true)
				.addField('❯ Tags',
					shorten(data.tags, 1000));
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
