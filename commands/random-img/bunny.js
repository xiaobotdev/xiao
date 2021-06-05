const Command = require('../../framework/Command');
const request = require('node-superfetch');
const facts = require('../../assets/json/bunny-fact');

module.exports = class BunnyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'bunny',
			aliases: ['bun', 'rabbit', 'bunny-fact', 'bun-fact', 'rabbit-fact'],
			group: 'random-img',
			memberName: 'bunny',
			description: 'Responds with a random bunny image and fact.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'bunnies.io',
					url: 'https://www.bunnies.io/',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		try {
			const { body } = await request
				.get('https://api.bunnies.io/v2/loop/random/')
				.query({ media: 'gif,png' });
			let fileToSend;
			let fileType = 'gif';
			const gif = await request.get(body.media.gif);
			if (Buffer.byteLength(gif.body) > 8e+6) {
				const poster = await request.get(body.media.poster);
				fileToSend = poster.body;
				fileType = 'png';
			} else {
				fileToSend = gif.body;
			}
			return msg.say(facts[Math.floor(Math.random() * facts.length)], {
				files: [{ attachment: fileToSend, name: `${body.id}.${fileType}` }]
			});
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
