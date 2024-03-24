const Command = require('../../framework/Command');
const request = require('node-superfetch');
const facts = require('../../assets/json/dog-fact');
const { THEDOGAPI_KEY } = process.env;

module.exports = class DogCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dog',
			aliases: ['puppy', 'dog-fact', 'puppy-fact', 'inu', 'inu-fact'],
			group: 'random-img',
			memberName: 'dog',
			description: 'Responds with a random dog image and fact.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'TheDogAPI',
					url: 'https://thedogapi.com/',
					reason: 'API',
					reasonURL: 'https://docs.thedogapi.com/'
				}
			]
		});
	}

	async run(msg) {
		try {
			const { body } = await request
				.get('https://api.thedogapi.com/v1/images/search')
				.query({ limit: 1 })
				.set({ 'x-api-key': THEDOGAPI_KEY });
			return msg.say(facts[Math.floor(Math.random() * facts.length)], { files: [body[0].url] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
