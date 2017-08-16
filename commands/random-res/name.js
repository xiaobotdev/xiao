const Command = require('../../structures/Command');
const { last, male, female } = require('../../assets/json/name');

module.exports = class RandomNameCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'name',
			group: 'random-res',
			memberName: 'name',
			description: 'Responds with a random name, with the gender of your choice.',
			args: [
				{
					key: 'gender',
					prompt: 'Which gender do you want to generate a name for?',
					type: 'string',
					default: 'both',
					validate: gender => {
						if (['male', 'female', 'both'].includes(gender.toLowerCase())) return true;
						return 'Please enter either male, female, or both.';
					},
					parse: gender => gender.toLowerCase()
				}
			]
		});
	}

	run(msg, args) { // eslint-disable-line consistent-return
		const { gender } = args;
		const lastName = last[Math.floor(Math.random() * last.length)];
		if (gender === 'male') {
			return msg.say(`${male[Math.floor(Math.random() * male.length)]} ${lastName}`);
		} else if (gender === 'female') {
			return msg.say(`${female[Math.floor(Math.random() * female.length)]} ${lastName}`);
		} else if (gender === 'both') {
			const genders = ['male', 'female'];
			const rGender = genders[Math.floor(Math.random() * genders.length)];
			if (rGender === 'male') return msg.say(`${male[Math.floor(Math.random() * male.length)]} ${lastName}`);
			else if (rGender === 'female') return msg.say(`${female[Math.floor(Math.random() * female.length)]} ${lastName}`);
		}
	}
};
