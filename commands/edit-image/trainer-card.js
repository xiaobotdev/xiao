const Command = require('../../structures/Command');
const request = require('node-superfetch');
const cheerio = require('cheerio');
const { stripIndents } = require('common-tags');
const { list } = require('../../util/Util');
const { styles, characters, badges } = require('../../assets/json/trainer-card');

module.exports = class TrainerCardCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'trainer-card',
			aliases: [
				'pkmn-trainer',
				'pokemon-trainer',
				'pokémon-trainer',
				'pkmn-trainer-card',
				'pokemon-trainer-card',
				'pokémon-trainer-card',
				'pkmn-tc',
				'pokemon-tc',
				'pokémon-tc',
				'ptc'
			],
			group: 'edit-image',
			memberName: 'trainer-card',
			description: 'Creates a trainer card for a Pokémon trainer.',
			details: stripIndents`
				**Styles:** ${Object.keys(styles).join(', ')}
				**Characters:** ${Object.keys(characters).join(', ')}
				**Badges:** ${Object.keys(badges).join(', ')}
			`,
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
					name: 'Pokécharms',
					url: 'https://pokecharms.com/',
					reason: 'Trainer Card API',
					reasonURL: 'https://pokecharms.com/trainer-card-maker/'
				}
			],
			args: [
				{
					key: 'style',
					prompt: `What style do you want to use? Either ${list(Object.keys(styles), 'or')}.`,
					type: 'string',
					oneOf: Object.keys(styles),
					parse: style => styles[style.toLowerCase()]
				},
				{
					key: 'name',
					prompt: 'What name do you want to use?',
					type: 'string',
					max: 12
				},
				{
					key: 'character',
					prompt: `What character do you want to use? Either ${list(Object.keys(characters, 'or'))}.`,
					type: 'string',
					oneOf: Object.keys(characters),
					parse: character => characters[character.toLowerCase()]
				},
				{
					key: 'badgeChoice',
					label: 'badges',
					prompt: `What badges do you want to use? Either ${list(Object.keys(badges), 'or')}.`,
					type: 'string',
					oneOf: Object.keys(badges),
					parse: choice => badges[choice.toLowerCase()]
				},
				{
					key: 'pokemon',
					label: 'Pokémon',
					prompt: 'What Pokémon do you want to use? Please enter up to 6 (in seperate messages).',
					type: 'pokemon',
					infinite: true
				}
			]
		});
	}

	async run(msg, { style, name, character, badgeChoice, pokemon }) {
		try {
			const pokemonUsed = [];
			for (const pkmn of pokemon) {
				const id = await this.fetchPokemonID(pkmn);
				pokemonUsed.push(id);
			}
			const card = await this.createCard(style, name, character, badgeChoice, pokemonUsed);
			return msg.say({ files: [{ attachment: card, name: 'trainer-card.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async createCard(style, name, character, badgeChoice, pokemon) {
		const { body } = await request
			.post('https://pokecharms.com/index.php?trainer-card-maker/render')
			.attach('trainername', name)
			.attach('background', style)
			.attach('character', character)
			.attach('badges', 8)
			.attach('badgesUsed', badgeChoice)
			.attach('pokemon', pokemon.length)
			.attach('pokemonUsed', pokemon)
			.attach('_xfResponseType', 'json');
		return Buffer.from(body.trainerCard, 'base64');
	}

	async fetchPokemonID(pokemon) {
		const { body } = await request
			.post('https://pokecharms.com/trainer-card-maker/pokemon-panels')
			.attach('number', pokemon.id)
			.attach('_xfResponseType', 'json');
		const $ = cheerio.load(body.templateHtml);
		return $('li[class="Panel"]').first().attr('data-id');
	}
};
