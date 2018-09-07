const Command = require('../../structures/Command');
const { list, firstUpperCase } = require('../../util/Util');
const planets = require('../../assets/json/gravity');

module.exports = class GravityCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'gravity',
			group: 'number-edit',
			memberName: 'gravity',
			description: 'Determines weight on another planet.',
			details: `**Planets:** ${Object.keys(planets).join(', ')}`,
			args: [
				{
					key: 'weight',
					prompt: 'What should the starting weight be (in KG)?',
					type: 'float'
				},
				{
					key: 'planet',
					prompt: `What planet do you want to use as the base? Either ${list(Object.keys(planets), 'or')}.`,
					type: 'string',
					oneOf: Object.keys(planets),
					parse: planet => planet.toLowerCase()
				}
			]
		});
	}

	run(msg, { weight, planet }) {
		return msg.say(`${weight} kg on ${firstUpperCase(planet)} is ${weight * planets[planet]} kg.`);
	}
};
