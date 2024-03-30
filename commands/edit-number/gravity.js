const Command = require('../../framework/Command');
const { list, firstUpperCase, formatNumber } = require('../../util/Util');
const planets = require('../../assets/json/gravity');

module.exports = class GravityCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'gravity',
			group: 'edit-number',
			memberName: 'gravity',
			description: 'Determines weight on another celestial object.',
			details: `**Celestial Objects:** ${Object.keys(planets).join(', ')}`,
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
					type: 'float'
				},
				{
					key: 'planet',
					label: 'celestial object',
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
