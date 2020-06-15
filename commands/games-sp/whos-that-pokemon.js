const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const { list } = require('../../util/Util');
const { silhouette } = require('../../util/Canvas');
const difficulties = ['easy', 'hard'];
const pokemonCount = 807;

module.exports = class WhosThatPokemonCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'whos-that-pokemon',
			aliases: ['who-pokemon', 'whos-that-pokémon', 'who-pokémon'],
			group: 'games-sp',
			memberName: 'whos-that-pokemon',
			description: 'Guess who that Pokémon is.',
			details: `**Difficulties:** ${difficulties.join(', ')}`,
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
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
				}
			],
			args: [
				{
					key: 'difficulty',
					prompt: `What should the difficulty of the game be? Either ${list(difficulties, 'or')}.`,
					type: 'string',
					oneOf: difficulties,
					parse: difficulty => difficulty.toLowerCase(),
					default: 'hard'
				},
				{
					key: 'pokemon',
					prompt: 'What Pokémon do you want to use?',
					type: 'integer',
					max: pokemonCount,
					min: 0,
					default: () => Math.floor(Math.random() * (pokemonCount + 1))
				}
			]
		});
	}

	async run(msg, { difficulty, pokemon }) {
		try {
			const data = await this.client.pokemon.fetch(pokemon.toString());
			const names = data.names.map(name => name.name.toLowerCase());
			const attachment = await this.fetchImage(data, difficulty);
			await msg.reply('**You have 15 seconds, who\'s that Pokémon?**', { files: [attachment] });
			const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
				max: 1,
				time: 15000
			});
			if (!msgs.size) return msg.reply(`Sorry, time is up! It was ${data.name}.`);
			const guess = msgs.first().content.toLowerCase();
			const slug = this.client.pokemon.makeSlug(guess);
			if (!names.includes(guess) && data.slug !== slug) return msg.reply(`Nope, sorry, it's ${data.name}.`);
			return msg.reply('Nice job! 10/10! You deserve some cake!');
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchImage(pokemon, difficulty) {
		const name = `${pokemon.id}.png`;
		const image = await request.get(pokemon.spriteImageURL);
		if (difficulty === 'easy') return { attachment: image.body, name };
		const base = await loadImage(image.body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		silhouette(ctx, 0, 0, base.width, base.height);
		return { attachment: canvas.toBuffer(), name };
	}
};
