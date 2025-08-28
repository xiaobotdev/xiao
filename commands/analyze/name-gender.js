const Command = require('../../framework/Command');
const request = require('node-superfetch');
const genders = {
	male: 'masculine',
	female: 'feminine'
};

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
		const prob = Math.round(body.probability * 100);
		return msg.say(`I'm ${prob}% sure ${body.name} is a ${genders[body.gender]} name.`);
	}
};
