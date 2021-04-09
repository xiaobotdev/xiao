const Command = require('../../structures/Command');
const generations = require('../../assets/json/generation');

module.exports = class GenerationCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'generation',
			aliases: ['gen'],
			group: 'analyze',
			memberName: 'generation',
			description: 'Responds with the Generation for the given year.',
			args: [
				{
					key: 'year',
					prompt: 'What year would you like to get the Generation for?',
					type: 'integer',
					min: 1,
					max: new Date().getFullYear()
				}
			]
		});
	}

	run(msg, { year }) {
		const generation = generations.find(gen => gen.start <= year && (gen.end ? gen.end >= year : true));
		return msg.say(`Someone born in ${year} is part of: **${generation.name}**`);
	}
};
