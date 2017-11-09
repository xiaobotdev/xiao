const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');

module.exports = class NeopetCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'neopet',
			aliases: ['neopet-image', 'neopet-image-finder'],
			group: 'search',
			memberName: 'neopet',
			description: 'Responds with the image of a specific Neopet.',
			args: [
				{
					key: 'pet',
					prompt: 'What pet would you like to get an image of?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { pet }) {
		try {
			const { text } = await snekfetch
				.get('http://www.sunnyneo.com/petimagefinder.php')
				.query({
					name: pet,
					size: 5,
					mood: 1
				});
			const link = text.match(/http:\/\/pets\.neopets\.com\/cp\/.+\.png/);
			if (!link) return msg.say('Could not find any results.');
			return msg.say(link[0]);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
