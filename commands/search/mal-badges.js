const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');

module.exports = class MalBadgesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'mal-badges',
			aliases: ['my-anime-list-badges', 'mal-badge', 'my-anime-list-badge'],
			group: 'search',
			memberName: 'mal-badges',
			description: 'Responds with a MyAnimeList user\'s mal-badges badge.',
			credit: [
				{
					name: 'mal-badges',
					url: 'http://www.mal-badges.net/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'user',
					prompt: 'What user would you like to get the badge of?',
					type: 'string',
					parse: user => encodeURIComponent(user)
				}
			]
		});
	}

	async run(msg, { user }) {
		try {
			const { body } = await request.get(`http://www.mal-badges.net/users/${user}/badge`);
			const embed = new MessageEmbed()
				.attachFiles([{ attachment: body, name: 'badge.png' }])
				.setTitle(user)
				.setImage('attachment://badge.png')
				.setURL(`http://www.mal-badges.net/users/${user}`)
				.setColor(0x00ADB5);
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 404 || err.status === 500) {
				return msg.say(`Could not find any results. Try updating at <http://www.mal-badges.net/users/${user}>.`);
			}
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
