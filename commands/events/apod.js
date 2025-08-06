const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const { GOV_KEY } = process.env;

module.exports = class ApodCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'apod',
			aliases: ['astronomy-picture-of-the-day'],
			group: 'events',
			description: 'Responds with today\'s Astronomy Picture of the Day.',
			credit: [
				{
					name: 'NASA',
					url: 'https://www.nasa.gov/',
					reason: 'APOD API',
					reasonURL: 'https://api.nasa.gov/'
				}
			]
		});
	}

	async run(msg) {
		const { body } = await request
			.get('https://api.nasa.gov/planetary/apod')
			.query({ api_key: GOV_KEY });
		const credit = body.copyright ? body.copyright.replaceAll('\n', '/') : 'Public Domain';
		return msg.say(stripIndents`
			**${body.title}**
			${body.explanation}

			_Image Credits: [${credit}](https://apod.nasa.gov/apod/astropix.html)_
		`, { files: body.media_type === 'image' ? [body.url] : [] });
	}
};
