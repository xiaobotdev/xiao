const Command = require('../../framework/Command');
const request = require('node-superfetch');
const genders = ['male', 'female', 'both'];

module.exports = class NameCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'name',
			group: 'random-res',
			memberName: 'name',
			description: 'Responds with a random name, with the gender of your choice.',
			credit: [
				{
					name: 'Random User Generator',
					url: 'https://randomuser.me/',
					reason: 'API',
					reasonURL: 'https://randomuser.me/documentation'
				}
			],
			args: [
				{
					key: 'gender',
					type: 'string',
					default: 'both',
					oneOf: genders,
					parse: gender => gender.toLowerCase()
				}
			]
		});
	}

	async run(msg, { gender }) {
		try {
			const { body } = await request
				.get('https://randomuser.me/api/')
				.query({
					inc: 'name',
					noinfo: '',
					gender: gender === 'both' ? '' : gender,
					nat: 'AU,US,CA,GB'
				});
			const data = body.results[0].name;
			return msg.say(`${data.first} ${data.last}`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
