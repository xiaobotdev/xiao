const Command = require('../../structures/Command');
const petImage = require('neopet-image-finder');
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
			aliases: ['neopets-pet', 'neopet-image', 'neopet-image-finder', 'neo'],
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
			const data = await petImage(pet, { mood: moods[mood] });
			if (!data) return msg.say('Could not find any results.');
			return msg.say({ files: [{ attachment: data.data, name: `${pet}.png` }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
