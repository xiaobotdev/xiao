const Command = require('../../framework/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class PokedexAbilityCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pokedex-ability',
			aliases: ['pokemon-ability', 'pokémon-ability', 'pokédex-ability', 'pkmn-ability'],
			group: 'pokedex',
			memberName: 'pokedex-ability',
			description: 'Searches the Pokédex for a Pokémon ability.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Pokémon',
					url: 'https://www.pokemon.com/us/',
					reason: 'Original Game'
				},
				{
					name: 'PokéAPI',
					url: 'https://pokeapi.co/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'ability',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { ability }) {
		try {
			const data = await this.client.pokemon.abilities.fetch(ability);
			if (!data) return msg.say('Could not find any results.');
			const embed = new MessageEmbed()
				.setColor(0xED1C24)
				.setTitle(data.name)
				.setDescription(data.description || 'No description available.');
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
