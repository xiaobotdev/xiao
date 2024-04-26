const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const request = require('node-superfetch');
const facts = require('../../assets/json/cat-fact');
const { THECATAPI_KEY } = process.env;

module.exports = class CatCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cat',
			aliases: ['neko', 'kitty', 'meow', 'cat-fact', 'neko-fact', 'kitty-fact', 'meow-fact'],
			group: 'random-img',
			memberName: 'cat',
			description: 'Responds with a random cat image and fact.',
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'TheCatAPI',
					url: 'https://thecatapi.com/',
					reason: 'API',
					reasonURL: 'https://docs.thecatapi.com/'
				},
				{
					name: 'Cat Facts API',
					url: 'https://catfact.ninja/',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		const { body } = await request
			.get('https://api.thecatapi.com/v1/images/search')
			.query({ limit: 1 })
			.set({ 'x-api-key': THECATAPI_KEY });
		const fact = await this.getFact();
		return msg.say(fact, { files: [body[0].url] });
	}

	async getFact() {
		try {
			const { body } = await request.get('https://catfact.ninja/fact');
			return body.fact;
		} catch {
			return facts[Math.floor(Math.random() * facts.length)];
		}
	}
};
