const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const crypto = require('crypto');

module.exports = class GravatarCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'gravatar',
			group: 'search',
			memberName: 'gravatar',
			description: 'Responds with the Gravatar for an email.',
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'email',
					prompt: 'What email do you want to get the Gravatar for?',
					type: 'string',
					parse: email => email.toLowerCase()
				}
			]
		});
	}

	async run(msg, { email }) {
		const hash = crypto.createHash('md5').update(email).digest('hex');
		try {
			const { body } = await snekfetch
				.get(`https://www.gravatar.com/avatar/${hash}`)
				.query({
					size: 500,
					default: 404,
					rating: msg.channel.nsfw ? 'r' : 'pg'
				});
			return msg.say({ files: [{ attachment: body, name: `${hash}.jpg` }] });
		} catch (err) {
			if (err.statusCode === 404) return msg.say('Could not find any results.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
