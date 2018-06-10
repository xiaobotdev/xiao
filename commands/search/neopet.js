const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { list } = require('../../util/Util');
const moods = {
	happy: 1,
	sad: 2,
	angry: 3,
	sick: 4,
	none: 5
};

module.exports = class NeopetCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'neopet',
			aliases: ['neopets-pet', 'neopet-image', 'neopet-image-finder'],
			group: 'search',
			memberName: 'neopet',
			description: 'Responds with the image of a specific Neopet.',
			args: [
				{
					key: 'pet',
					prompt: 'What pet would you like to get an image of?',
					type: 'string'
				},
				{
					key: 'mood',
					prompt: `What mood should the pet be in? Either ${list(Object.keys(moods), 'or')}.`,
					type: 'string',
					default: 'happy',
					validate: mood => {
						if (moods[mood.toLowerCase()]) return true;
						return `Invalid mood, please enter either ${list(Object.keys(moods), 'or')}.`;
					},
					parse: mood => mood.toLowerCase()
				}
			]
		});
	}

	async run(msg, { pet, mood }) {
		try {
			const { text } = await request
				.get('http://www.sunnyneo.com/petimagefinder.php')
				.query({
					name: pet,
					size: 5,
					mood: moods[mood]
				});
			const link = text.match(/http:\/\/pets\.neopets\.com\/cp\/.+\.png/);
			if (!link) return msg.say('Could not find any results.');
			return msg.say(link[0]);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
