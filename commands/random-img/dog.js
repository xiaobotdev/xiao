const Command = require('../../structures/Command');
const request = require('node-superfetch');
const facts = require('../../assets/json/dog-fact');

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
					name: 'Dog CEO',
					url: 'https://dog.ceo/',
					reason: 'Dog API',
					reasonURL: 'https://dog.ceo/dog-api/'
				}
			]
		});
	}

	async run(msg) {
		try {
			const { body } = await request.get('https://dog.ceo/api/breeds/image/random');
			return msg.say(facts[Math.floor(Math.random() * facts.length)], { files: [body.message] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
