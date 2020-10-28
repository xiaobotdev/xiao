const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const request = require('node-superfetch');
const { silhouette } = require('../../util/Canvas');
const path = require('path');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Pokemon Solid.ttf'), { family: 'Pokemon' });
const pokemonCount = 893;

module.exports = class WhosThatPokemonCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'whos-that-pokemon',
			aliases: ['who-pokemon', 'whos-that-pokémon', 'who-pokémon'],
			group: 'games-sp',
			memberName: 'whos-that-pokemon',
			description: 'Guess who that Pokémon is.',
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
				},
				{
					name: 'u/CaptainRako',
					url: 'https://www.reddit.com/user/CaptainRako/',
					reason: 'Background Image',
					// eslint-disable-next-line max-len
					reasonURL: 'https://www.reddit.com/r/pokemon/comments/420xiv/whos_that_pokemon_1920x1080_hd_template_i_just/'
				}
			],
			args: [
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

	async run(msg, { pokemon }) {
		try {
			const data = await this.client.pokemon.fetch(pokemon.toString());
			const names = data.names.map(name => name.name.toLowerCase());
			const attachment = await this.createImage(data, true);
			const answerAttachment = await this.createImage(data, false);
			await msg.reply('**You have 15 seconds, who\'s that Pokémon?**', { files: [attachment] });
			const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
				max: 1,
				time: 15000
			});
			if (!msgs.size) return msg.reply(`Sorry, time is up! It was ${data.name}.`, { files: [answerAttachment] });
			const guess = msgs.first().content.toLowerCase();
			const slug = this.client.pokemon.makeSlug(guess);
			if (!names.includes(guess) && data.slug !== slug) {
				return msg.reply(`Nope, sorry, it's ${data.name}.`, { files: [answerAttachment] });
			}
			return msg.reply('Nice job! 10/10! You deserve some cake!', { files: [answerAttachment] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async createImage(pokemon, hide) {
		const name = `${pokemon.id}${hide ? '-hidden' : ''}.png`;
		const image = await request.get(pokemon.spriteImageURL);
		const bg = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'whos-that-pokemon.png'));
		const pkmn = await loadImage(image.body);
		const canvas = createCanvas(bg.width, bg.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(bg, 0, 0);
		if (hide) {
			const silhouetteCanvas = createCanvas(pkmn.width, pkmn.height);
			const silhouetteCtx = silhouetteCanvas.getContext('2d');
			silhouetteCtx.drawImage(pkmn, 0, 0);
			silhouette(silhouetteCtx, 0, 0, pkmn.width, pkmn.height);
			ctx.drawImage(silhouetteCanvas, 30, 39, 200, 200);
		} else {
			ctx.drawImage(pkmn, 30, 39, 200, 200);
			ctx.font = '60px Pokemon';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'bottom';
			ctx.lineWidth = 10;
			ctx.strokeStyle = '#3c5aa6';
			ctx.strokeText(pokemon.name, 362, 158, 250);
			ctx.fillStyle = '#ffcb05';
			ctx.fillText(pokemon.name, 362, 158, 250);
		}
		return { attachment: canvas.toBuffer(), name };
	}
};
