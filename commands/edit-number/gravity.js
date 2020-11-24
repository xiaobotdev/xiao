const Command = require('../../structures/Command');
const { list, firstUpperCase, formatNumber } = require('../../util/Util');
const planets = require('../../assets/json/gravity');

module.exports = class GravityCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'gravity',
			group: 'edit-number',
			memberName: 'gravity',
			description: 'Determines weight on another planet.',
			details: `**Planets:** ${Object.keys(planets).join(', ')}`,
			credit: [
				{
					name: 'NASA',
					url: 'https://www.nasa.gov/',
					reason: 'Planet Gravity Data',
					reasonURL: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/planet_table_ratio.html'
				}
			],
			args: [
				{
					key: 'weight',
					prompt: 'What should the starting weight be (in KG)?',
					type: 'float'
				},
				{
					key: 'planet',
					label: 'celestial object',
					prompt: `What celestial object do you want to use? Either ${list(Object.keys(planets), 'or')}.`,
					type: 'string',
					oneOf: Object.keys(planets),
					parse: planet => planet.toLowerCase()
				}
			]
		});
	}

	run(msg, { weight, planet }) {
		const result = weight * planets[planet];
		return msg.say(`${formatNumber(weight)} kg on ${firstUpperCase(planet)} is ${formatNumber(result)} kg.`);
	}
};
