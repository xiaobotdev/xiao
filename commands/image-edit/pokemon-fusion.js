const Command = require('../../structures/Command');
const pokemon = require('../../assets/json/pokemon-fusion');

module.exports = class PokemonFusionCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pokemon-fusion',
			aliases: ['poke-fusion', 'poke-fuse'],
			group: 'image-edit',
			memberName: 'pokemon-fusion',
			description: 'Fuses two Generation I Pokémon together.',
			args: [
				{
					key: 'source1',
					prompt: 'What Pokémon should be fused?',
					type: 'string',
					validate: source1 => {
						if (pokemon[source1.toLowerCase()]) return true;
						return 'Only Pokémon from Generation I may be used.';
					},
					parse: source1 => pokemon[source1.toLowerCase()]
				},
				{
					key: 'source2',
					prompt: 'What Pokémon should be fused?',
					type: 'string',
					validate: source2 => {
						if (pokemon[source2.toLowerCase()]) return true;
						return 'Only Pokémon from Generation I may be used.';
					},
					parse: source2 => pokemon[source2.toLowerCase()]
				}
			]
		});
	}

	run(msg, args) {
		const { source1, source2 } = args;
		return msg.say({ files: [`http://images.alexonsager.net/pokemon/fused/${source1}/${source1}.${source2}.png`] });
	}
};
