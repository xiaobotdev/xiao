const Command = require('../../structures/Command');
const { Readable } = require('stream');
const { reactIfAble } = require('../../util/Util');
const pokemonCount = 893;
const blacklist = [0, 803, 804, 805, 806, 807, 808, 809, 890, 891, 892, 893];

module.exports = class WhosThatPokemonCryCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'whos-that-pokemon-cry',
			aliases: ['who-pokemon-cry', 'whos-that-pokémon-cry', 'who-pokémon-cry'],
			group: 'games-sp',
			memberName: 'whos-that-pokemon-cry',
			description: 'Guess who that Pokémon is, based on their cry.',
			throttling: {
				usages: 1,
				duration: 10
			},
			guildOnly: true,
			userPermissions: ['CONNECT', 'SPEAK', 'ATTACH_FILES'],
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
					name: 'Serebii.net',
					url: 'https://www.serebii.net/index2.shtml',
					reason: 'Images'
				},
				{
					name: 'u/CaptainRako',
					url: 'https://www.reddit.com/user/CaptainRako/',
					reason: 'Background Image',
					// eslint-disable-next-line max-len
					reasonURL: 'https://www.reddit.com/r/pokemon/comments/420xiv/whos_that_pokemon_1920x1080_hd_template_i_just/'
				},
				{
					name: 'DaFont',
					url: 'https://www.dafont.com/',
					reason: 'Pokemon Solid Font',
					reasonURL: 'https://www.dafont.com/pokemon.font'
				},
				{
					name: 'Pokemoncries.com',
					url: 'https://pokemoncries.com/',
					reason: 'Cry Sound Effects'
				}
			],
			args: [
				{
					key: 'pokemon',
					prompt: 'What Pokémon do you want to use?',
					type: 'integer',
					max: pokemonCount,
					min: 0,
					default: () => {
						let num;
						while (!num) {
							const chosen = Math.floor(Math.random() * (pokemonCount + 1));
							if (blacklist.includes(chosen)) continue;
							num = chosen;
						}
						return num;
					}
				}
			]
		});
	}

	async run(msg, { pokemon }) {
		const connection = this.client.voice.connections.get(msg.guild.id);
		if (!connection) {
			const usage = this.client.registry.commands.get('join').usage();
			return msg.reply(`I am not in a voice channel. Use ${usage} to fix that!`);
		}
		try {
			const data = await this.client.pokemon.fetch(pokemon.toString());
			const names = data.names.map(name => name.name.toLowerCase());
			const attachment = await this.client.registry.commands.get('whos-that-pokemon').createImage(data, false);
			await data.fetchCry();
			connection.play(Readable.from([data.cry]));
			await reactIfAble(msg, this.client.user, '🔉');
			await msg.reply('**You have 15 seconds, who\'s that Pokémon?**');
			const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
				max: 1,
				time: 15000
			});
			connection.play(Readable.from([data.cry]));
			if (!msgs.size) return msg.reply(`Time! It's **${data.name}**!`, { files: [attachment] });
			const guess = msgs.first().content.toLowerCase();
			const slug = this.client.pokemon.makeSlug(guess);
			if (!names.includes(guess) && data.slug !== slug) {
				return msg.reply(`Nope! It's **${data.name}**!`, { files: [attachment] });
			}
			return msg.reply(`Nice! It's **${data.name}**!`, { files: [attachment] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
