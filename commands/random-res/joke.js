const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const blacklistFlags = ['religious', 'racist', 'sexist'];
const nsfw = ['nsfw', 'explicit'];

module.exports = class JokeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'joke',
			group: 'random-res',
			memberName: 'joke',
			description: 'Responds with a random joke.',
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
		const { body } = await request
			.get('https://v2.jokeapi.dev/joke/Any')
			.query({ blacklistFlags: blacklist.join(',') });
		if (body.type === 'twopart') {
			return msg.say(stripIndents`
				${body.setup}
				${body.delivery}
			`);
		}
		return msg.say(body.joke);
	}
};
