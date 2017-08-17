const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');

module.exports = class NameCommand extends Command {
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

	async run(msg, args) {
		const { gender } = args;
		const { body } = await snekfetch
			.get('http://namey.muffinlabs.com/name.json')
			.query({
				with_surname: true,
				type: gender,
				frequency: 'all'
			});
		return msg.say(body[0]);
	}
};
