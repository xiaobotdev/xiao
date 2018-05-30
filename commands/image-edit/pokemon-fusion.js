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
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'body',
					prompt: 'What Pokémon should be fused as the body?',
					type: 'string',
					validate: body => {
						if (pokemon[body.toLowerCase()]) return true;
						return 'Invalid body, only Pokémon from Generation I may be used.';
					},
					parse: body => pokemon[body.toLowerCase()]
				},
				{
					key: 'palette',
					prompt: 'What Pokémon should be fused as the palette?',
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

	run(msg, { body, palette }) {
		return msg.say({ files: [`http://images.alexonsager.net/pokemon/fused/${body}/${body}.${palette}.png`] });
	}
};
