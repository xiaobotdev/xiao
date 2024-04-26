const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
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
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'TheDogAPI',
					url: 'https://thedogapi.com/',
					reason: 'API',
					reasonURL: 'https://docs.thedogapi.com/'
				},
				{
					name: 'Dog API',
					url: 'https://kinduff.github.io/dog-api/',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		const { body } = await request
			.get('https://api.thedogapi.com/v1/images/search')
			.query({ limit: 1 })
			.set({ 'x-api-key': THEDOGAPI_KEY });
		const fact = await this.getFact();
		return msg.say(fact, { files: [body[0].url] });
	}

	async getFact() {
		try {
			const { body } = await request.get('https://dog-api.kinduff.com/api/facts');
			return body.facts[0];
		} catch {
			return facts[Math.floor(Math.random() * facts.length)];
		}
	}
};
