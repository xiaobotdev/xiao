const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const moment = require('moment');

module.exports = class RedditUserCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reddit-user',
			aliases: ['reddit-u', 'u/', 'karma', 'reddit-karma'],
			group: 'search',
			memberName: 'reddit-user',
			description: 'Responds with information on a Reddit user.',
			clientPermissions: ['EMBED_LINKS'],
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
			const embed = new MessageEmbed()
				.setColor(0xFF4500)
				.setAuthor('Reddit', 'https://i.imgur.com/DSBOK0P.png', 'https://www.reddit.com/')
				.setThumbnail(data.icon_img)
				.addField('❯ Username', data.name, true)
				.addField('❯ ID', data.id, true)
				.addField('❯ Karma', data.link_karma + data.comment_karma, true)
				.addField('❯ Creation Date', moment.utc(data.created * 1000).format('MM/DD/YYYY h:mm A'), true)
				.addField('❯ Gold?', data.is_gold ? 'Yes' : 'No', true)
				.addField('❯ Verified?', data.verified ? 'Yes' : 'No', true)
				.addField('❯ Suspended?', data.is_suspended ? 'Yes' : 'No', true)
				.addField('❯ Over 18?', data.over_18 ? 'Yes' : 'No', true);
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
