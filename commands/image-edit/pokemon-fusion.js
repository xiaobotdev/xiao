const Command = require('../../structures/Command');
const pokemon = require('../../assets/json/pokemon-fusion');

module.exports = class PokemonFusionCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pokemon-fusion',
			aliases: ['poke-fusion', 'poke-fuse', 'pokémon-fusion', 'poké-fusion', 'poké-fuse'],
			group: 'image-edit',
			memberName: 'pokemon-fusion',
			description: 'Fuses two Generation I Pokémon together.',
			args: [
				{
					key: 'body',
					prompt: 'What Pokémon should be fused?',
					type: 'string',
					validate: body => {
						if (pokemon[body.toLowerCase()]) return true;
						return 'Invalid body, only Pokémon from Generation I may be used.';
					},
					parse: body => pokemon[body.toLowerCase()]
				},
				{
					key: 'palette',
					prompt: 'What Pokémon should be fused?',
					type: 'string',
					validate: palette => {
						if (pokemon[palette.toLowerCase()]) return true;
						return 'Invalid palette, only Pokémon from Generation I may be used.';
					},
					parse: palette => pokemon[palette.toLowerCase()]
				}
			]
		});
	}

	run(msg, args) {
		const { body, palette } = args;
		return msg.say(`http://images.alexonsager.net/pokemon/fused/${body}/${palette}.${body}.png`);
	}
};
