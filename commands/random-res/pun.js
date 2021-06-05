const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const blacklistFlags = ['religious', 'racist', 'sexist'];
const nsfw = ['nsfw', 'explicit'];

module.exports = class PunCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pun',
			group: 'random-res',
			memberName: 'pun',
			description: 'Responds with a random pun.',
			credit: [
				{
					name: 'JokeAPI',
					url: 'https://v2.jokeapi.dev/',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		const blacklist = msg.channel.nsfw ? blacklistFlags : blacklistFlags.concat(nsfw);
		try {
			const { body } = await request
				.get('https://v2.jokeapi.dev/joke/Pun')
				.query({ blacklistFlags: blacklist.join(',') });
			if (body.type === 'twopart') {
				return msg.say(stripIndents`
					${body.setup}
					${body.delivery}
				`);
			}
			return msg.say(body.joke);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
