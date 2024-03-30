const Command = require('../../framework/Command');
const request = require('node-superfetch');

module.exports = class MtgCardCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'mtg-card',
			aliases: ['mtg', 'discord', 'discord-card', 'mtg-discord', 'mtg-discord-card'],
			group: 'random-res',
			memberName: 'github-zen',
			description: 'Responds with a random castable Magic: The Gathering card for Discord, Lord of Disharmony.',
			credit: [
				{
					name: 'Scryfall',
					url: 'https://scryfall.com/',
					reason: 'Random Results',
					reasonURL: 'https://scryfall.com/random?q=is%3Aspell+game%3Apaper'
				}
			]
		});
	}

	async run(msg) {
		const { url } = await request.get('https://scryfall.com/random?q=is%3Aspell+game%3Apaper');
		return msg.say(url);
	}
};
