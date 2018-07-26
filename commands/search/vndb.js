const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js');
const { shorten } = require('../../util/Util');

module.exports = class VNDBCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'vndb',
			aliases: ['visual-novel', 'vn'],
			group: 'search',
			memberName: 'vndb',
			description: 'Responds with information on a Visual Novel.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What visual novel would you like to get information on?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const data = await this.fetchVN(query);
			if (!data) return msg.say('Could not find any results.');
			const embed = new MessageEmbed()
				.setColor(0x000407)
				.setAuthor('VNDB', 'https://i.imgur.com/BIxjIby.png', 'https://vndb.org/')
				.setTitle(data.title)
				.setDescription(shorten(data.description || 'No description available.'))
				.setURL(data.url)
				.setThumbnail(data.image)
				.addField('❯ Developer', `[${data.developer.name}](${data.developer.url})`);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchVN(query) {
		const { text } = await request
			.get('https://vndb.org/v/all')
			.query({ q: query });
		const id = text.match(/<a href="\/v([0-9]+)" title=/);
		if (!id) return null;
		const url = `https://vndb.org/v${id[1]}`;
		const details = await request.get(url);
		const detailsText = details.text;
		const dev = detailsText.match(/<a href="\/p([0-9]+)"/);
		const devURL = `https://vndb.org/p${dev[1]}`;
		const devReq = await request.get(devURL);
		const devText = devReq.text;
		const description = detailsText.match(/<h2>Description<\/h2><p>(.+)<\/p><\/td>/)[1]
			.replace(/<br>/g, '\n')
			.replace(/<a href="(.+)" rel="nofollow">(.+)<\/a>/g, '[$2]($1)');
		return {
			id: id[1],
			url,
			title: detailsText.match(/<title>(.+)<\/title>/)[1],
			developer: {
				name: devText.match(/<title>(.+)<\/title>/)[1],
				url: devURL
			},
			description: description === '-' ? null : description,
			image: detailsText.match(/https:\/\/s.vndb.org\/cv\/[0-9]+\/[0-9]+\.jpg/)[0]
		};
	}
};
