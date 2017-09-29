const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { shorten } = require('../../structures/Util');
const { GOV_KEY } = process.env;

module.exports = class AstronomyPictureOfTheDayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'astronomy-picture-of-the-day',
			aliases: ['nasa-apod', 'apod', 'nasa-astronomy-picture-of-the-day'],
			group: 'random',
			memberName: 'astronomy-picture-of-the-day',
			description: 'Responds with today\'s Astronomy Picture of the Day.',
			clientPermissions: ['ATTACH_FILES']
		});
	}

	async run(msg) {
		try {
			const { body } = await snekfetch
				.get('https://api.nasa.gov/planetary/apod')
				.query({ api_key: GOV_KEY });
			return msg.say(shorten(body.explanation), { files: [body.url] });
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
