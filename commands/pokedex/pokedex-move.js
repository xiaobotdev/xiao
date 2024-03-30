const Command = require('../../framework/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class PokedexMoveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pokedex-move',
			aliases: ['pokemon-move', 'pokémon-move', 'pokédex-move', 'pkmn-move'],
			group: 'pokedex',
			memberName: 'pokedex-move',
			description: 'Searches the Pokédex for a Pokémon move.',
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
					key: 'move',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { move }) {
		const data = await this.client.pokemon.moves.fetch(move);
		if (!data) return msg.say('Could not find any results.');
		const embed = new MessageEmbed()
			.setColor(0xED1C24)
			.setTitle(data.name)
			.setDescription(data.description ? data.cleanDescription : 'No description available.')
			.addField('❯ Accuracy', `${data.accuracy}%`, true)
			.addField('❯ Power', data.power.toString() || '???', true)
			.addField('❯ PP', data.pp.toString(), true)
			.addField('❯ Type', data.type.toString(), true)
			.addField('❯ Contest Type', data.contestType || 'N/A', true)
			.addField('❯ Class', data.class, true);
		return msg.embed(embed);
	}
};
