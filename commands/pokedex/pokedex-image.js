const Command = require('../../structures/Command');

module.exports = class PokedexImageCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pokedex-image',
			aliases: [
				'pokemon-image',
				'pokémon-image',
				'pokédex-image',
				'pkmn-image',
				'pokedex-img',
				'pokémon-img',
				'pokemon-img',
				'pokédex-img',
				'pkmn-img'
			],
			group: 'pokedex',
			memberName: 'pokedex-image',
			description: 'Responds with the image of a Pokémon.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Pokémon',
					url: 'https://www.pokemon.com/us/',
					reason: 'Images, Original Game'
				},
				{
					name: 'PokéAPI',
					url: 'https://pokeapi.co/',
					reason: 'API'
				},
				{
					name: 'Serebii.net',
					url: 'https://www.serebii.net/index2.shtml',
					reason: 'Images'
				}
			],
			args: [
				{
					key: 'pokemon',
					prompt: 'What Pokémon would you like to get the image of?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { pokemon }) {
		try {
			const data = await this.client.pokemon.fetch(pokemon);
			if (!data) return msg.say('Could not find any results.');
			return msg.say(`#${data.displayID} - ${data.name}`, { files: [data.spriteImageURL] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
