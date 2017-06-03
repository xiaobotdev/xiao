const Command = require('../../structures/Command');
const pokemon = require('../../assets/json/pokemon-fusion');

module.exports = class PokemonFusionCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pokemon-fusion',
            aliases: ['poke-fusion', 'poke-fuse'],
            group: 'random',
            memberName: 'pokemon-fusion',
            description: 'Fuses two Generation 1 Pokémon together.',
            args: [
                {
                    key: 'source1',
                    prompt: 'What Pokémon should be fused?',
                    type: 'string',
                    validate: (source1) => {
                        if (pokemon[source1.toLowerCase()]) return true;
                        else return 'Only Pokémon from Generation 1 may be used.';
                    },
                    parse: (source1) => pokemon[source1.toLowerCase()]
                },
                {
                    key: 'source2',
                    prompt: 'What Pokémon should be fused?',
                    type: 'string',
                    validate: (source2) => {
                        if (pokemon[source2.toLowerCase()]) return true;
                        else return 'Only Pokémon from Generation 1 may be used.';
                    },
                    parse: (source2) => pokemon[source2.toLowerCase()]
                }
            ]
        });
    }

    run(msg, args) {
        const { source1, source2 } = args;
        return msg.say(`http://images.alexonsager.net/pokemon/fused/${source1}/${source1}.${source2}.png`);
    }
};
