const Command = require('../../framework/Command');

module.exports = class WaistHipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'waist-hip',
			aliases: ['waist-hip-ratio', 'w-h-ratio'],
			group: 'analyze',
			description: 'Responds with the waist-hip ratio of measurements.',
			args: [
				{
					key: 'waist',
					type: 'integer',
					min: 1,
					max: 200
				},
				{
					key: 'hip',
					type: 'integer',
					min: 1,
					max: 200
				}
			]
		});
	}

	run(msg, { waist, hip }) {
		const ratio = waist / hip;
		return msg.say(`The waist-hip ratio of someone with a ${waist} inch waist and ${hip} inch hips is **${ratio}**.`);
	}
};
