const Command = require('../../framework/Command');
const request = require('node-superfetch');

module.exports = class NameGenderCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'name-gender',
			aliases: ['guess-name-gender', 'name-gender-guess', 'gender-name'],
			group: 'analyze',
			description: 'Determines the gender of a name.',
			credit: [
				{
					name: 'Genderize.io',
					url: 'https://genderize.io/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'name',
					type: 'string',
					max: 20
				}
			]
		});
	}

	async run(msg, { name }) {
		const { body } = await request
			.get(`https://api.genderize.io/`)
			.query({ name });
		if (!body.gender) return msg.say(`I have no idea what gender ${body.name} is.`);
		return msg.say(`I'm ${Math.round(body.probability * 100)}% sure ${body.name} is a ${body.gender} name.`);
	}
};
