const Command = require('../../framework/Command');
const pokemon = require('../../assets/json/pokemon-fusion');
const { firstUpperCase } = require('../../util/Util');
const pokeKeys = Object.keys(pokemon);

module.exports = class PokemonFusionCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pokemon-fusion',
			aliases: ['poke-fusion', 'poke-fuse', 'pokémon-fusion', 'poké-fusion', 'poké-fuse', 'pkmn-fuse', 'pkmn-fusion'],
			group: 'edit-image',
			memberName: 'pokemon-fusion',
			description: 'Fuses two Generation I Pokémon together.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Pokémon',
					url: 'https://www.pokemon.com/us/',
					reason: 'Original Game'
				},
				{
					name: 'Pokemon Fusion',
					url: 'https://pokemon.alexonsager.net/',
					reason: 'Images'
				}
			],
			args: [
				{
					key: 'body',
					type: 'string',
					default: () => pokeKeys[Math.floor(Math.random() * pokeKeys.length)],
					validate: body => {
						if (pokemon[body.toLowerCase()]) return true;
						return 'Invalid body, only Pokémon from Generation I may be used.';
					},
					parse: body => body.toLowerCase()
				},
				{
					key: 'palette',
					type: 'string',
					default: () => pokeKeys[Math.floor(Math.random() * pokeKeys.length)],
					validate: palette => {
						if (pokemon[palette.toLowerCase()]) return true;
						return 'Invalid palette, only Pokémon from Generation I may be used.';
					},
					parse: palette => palette.toLowerCase()
				}
			]
		});
	}

	run(msg, { body, palette }) {
		const prefix = body.slice(0, Math.round(body.length / 2));
		const suffix = palette.slice(Math.round(palette.length / 2));
		return msg.say(firstUpperCase(`${prefix}${suffix}`), {
			files: [`http://images.alexonsager.net/pokemon/fused/${pokemon[body]}/${pokemon[body]}.${pokemon[palette]}.png`]
		});
	}
};
