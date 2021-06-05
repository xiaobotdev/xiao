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
					prompt: 'What move would you like to get information on?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { move }) {
		try {
			const data = await this.client.pokemon.moves.fetch(move);
			if (!data) return msg.say('Could not find any results.');
			const embed = new MessageEmbed()
				.setColor(0xED1C24)
				.setTitle(data.name)
				.setDescription(data.description ? data.cleanDescription : 'No description available.')
				.addField('❯ Accuracy', `${data.accuracy}%`, true)
				.addField('❯ Power', data.power || '???', true)
				.addField('❯ PP', data.pp, true)
				.addField('❯ Type', data.type, true)
				.addField('❯ Contest Type', data.contestType || 'N/A', true)
				.addField('❯ Class', data.class, true);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
