const Command = require('../../framework/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const moment = require('moment');
const { formatNumber } = require('../../util/Util');

module.exports = class RedditCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reddit',
			aliases: ['u/'],
			group: 'search',
			memberName: 'reddit',
			description: 'Responds with information on a Reddit user.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Reddit',
					url: 'https://www.reddit.com/',
					reason: 'API',
					reasonURL: 'https://www.reddit.com/dev/api/'
				}
			],
			args: [
				{
					key: 'user',
					prompt: 'What user would you like to get information on?',
					type: 'string',
					parse: user => encodeURIComponent(user)
				}
			]
		});
	}

	async run(msg, { user }) {
		try {
			const { body } = await request.get(`https://www.reddit.com/user/${user}/about.json`);
			const { data } = body;
			if (data.hide_from_robots) return msg.say('This user is hidden from bots.');
			const embed = new MessageEmbed()
				.setColor(0xFF4500)
				.setAuthor('Reddit', 'https://i.imgur.com/DSBOK0P.png', 'https://www.reddit.com/')
				.setThumbnail(data.icon_img)
				.setURL(`https://www.reddit.com/user/${user}`)
				.setTitle(`/u/${data.name}`)
				.addField('❯ Username', data.name, true)
				.addField('❯ ID', data.id, true)
				.addField('❯ Karma', formatNumber(data.link_karma + data.comment_karma), true)
				.addField('❯ Creation Date', moment.utc(data.created_utc * 1000).format('MM/DD/YYYY h:mm A'), true)
				.addField('❯ Gold?', data.is_gold ? 'Yes' : 'No', true)
				.addField('❯ Verified?', data.verified ? 'Yes' : 'No', true);
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
