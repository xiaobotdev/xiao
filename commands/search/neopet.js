const Command = require('../../framework/Command');
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
			group: 'search',
			description: 'Responds with the image of a specific Neopet.',
			credit: [
				{
					name: 'Neopets',
					url: 'http://www.neopets.com/',
					reason: 'Pet Image Data, Original Game'
				}
			],
			args: [
				{
					key: 'pet',
					type: 'string'
				},
				{
					key: 'mood',
					type: 'string',
					default: 1,
					validate: mood => {
						if (moods[mood.toLowerCase()]) return true;
						return `Invalid mood, please enter either ${list(Object.keys(moods), 'or')}.`;
					},
					parse: mood => moods[mood.toLowerCase()]
				}
			]
		});
	}

	async run(msg, { pet, mood }) {
		const petImg = await petImage(pet, { mood, size: 5 });
		if (!petImg) return msg.say('Could not find any results.');
		return msg.say({ files: [{ attachment: petImg.data, name: `${pet}-${mood}.png` }] });
	}
};
