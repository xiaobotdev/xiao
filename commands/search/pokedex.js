const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { stripIndents } = require('common-tags');
const { filterPkmn } = require('../../structures/Util');

module.exports = class PokedexCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pokedex',
			aliases: ['pokemon', 'pokémon', 'pokédex'],
			group: 'search',
			memberName: 'pokedex',
			description: 'Searches the Pokédex for a Pokémon.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'pokemon',
					prompt: 'What Pokémon would you like to get information on?',
					type: 'string',
					parse: pokemon => pokemon.toLowerCase().replace(/ /g, '-')
				}
			]
		});
	}

	async run(msg, args) {
		const { pokemon } = args;
		try {
			const { body } = await snekfetch
				.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`);
			const id = `${'000'.slice(body.id.toString().length)}${body.id}`;
			const embed = new MessageEmbed()
				.setColor(0xED1C24)
				.setAuthor(`#${id} - ${filterPkmn(body.names).name}`, `https://www.serebii.net/pokedex-sm/icon/${id}.png`)
				.setURL(`https://www.serebii.net/pokedex-sm/${id}.shtml`)
				.setDescription(stripIndents`
					**The ${filterPkmn(body.genera).genus} Pokémon**
					${filterPkmn(body.flavor_text_entries).flavor_text.replace(/(\n|\f|\r)/g, ' ')}
				`)
				.setThumbnail(`https://www.serebii.net/sunmoon/pokemon/${id}.png`);
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
