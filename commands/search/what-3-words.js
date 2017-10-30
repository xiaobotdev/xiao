const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { W3W_KEY, GOOGLE_KEY } = process.env;

module.exports = class What3WordsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'what-3-words',
			aliases: ['what-three-words', 'w3w'],
			group: 'search',
			memberName: 'what-3-words',
			description: 'Responds with a map based upon the 3 words you provide.',
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'zoom',
					label: 'zoom level',
					prompt: 'What would you like the zoom level to be? Must be a number from 1-20.',
					type: 'integer',
					validate: zoom => {
						if (zoom < 21 && zoom > 0) return true;
						return 'Invalid zoom level, please enter a zoom level from 1-20.';
					}
				},
				{
					key: 'word1',
					prompt: 'What is the first word you would like to use?',
					type: 'string'
				},
				{
					key: 'word2',
					prompt: 'What is the second word you would like to use?',
					type: 'string'
				},
				{
					key: 'word3',
					prompt: 'What is the third word you would like to use?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { zoom, word1, word2, word3 }) {
		try {
			const { body } = await snekfetch
				.get('https://api.what3words.com/v2/forward')
				.query({
					addr: `${word1}.${word2}.${word3}`,
					key: W3W_KEY
				});
			if (body.status.code === 300) return msg.say('Could not find any results.');
			const map = await snekfetch
				.get('https://maps.googleapis.com/maps/api/staticmap')
				.query({
					center: `${body.geometry.lat},${body.geometry.lng}`,
					zoom,
					size: '500x500',
					key: GOOGLE_KEY
				});
			return msg.say(`<${body.map}>`, { files: [{ attachment: map.body, name: 'what-3-words.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
