const Command = require('../../framework/Command');
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
			group: 'search',
			memberName: 'neopet',
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
		try {
			const { body } = await request.get(`http://pets.neopets.com/cpn/${encodeURIComponent(pet)}/${mood}/5.png`);
			return msg.say({ files: [{ attachment: body, name: `${pet}-${mood}.png` }] });
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
