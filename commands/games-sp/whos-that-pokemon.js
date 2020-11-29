const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const request = require('node-superfetch');
const { reactIfAble } = require('../../util/Util');
const { silhouette } = require('../../util/Canvas');
const path = require('path');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Pokemon Solid.ttf'), { family: 'Pokemon' });

module.exports = class WhosThatPokemonCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'whos-that-pokemon',
			aliases: ['who-pokemon', 'whos-that-pokémon', 'who-pokémon', 'who-pkmn'],
			group: 'games-sp',
			memberName: 'whos-that-pokemon',
			description: 'Guess who that Pokémon is, based on their silhouette.',
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
					name: '4Kids',
					url: 'https://www.4kidsentertainmentinc.com/',
					reason: '"Who\'s That Pokémon?" Sound'
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
					name: 'The Sounds Resource',
					url: 'https://www.sounds-resource.com/',
					reason: 'Cry Sound Effects (Gen 1-7)',
					reasonURL: 'https://www.sounds-resource.com/3ds/pokemonultrasunultramoon/'
				},
				{
					name: 'The Sounds Resource',
					url: 'https://www.sounds-resource.com/',
					reason: 'Cry Sound Effects (Gen 8)',
					reasonURL: 'https://www.sounds-resource.com/nintendo_switch/pokemonswordshield/'
				},
				{
					name: 'Pokémon Showdown',
					url: 'https://play.pokemonshowdown.com/',
					reason: 'Cry Sound Effects (Meltan and Melmetal)',
					reasonURL: 'https://play.pokemonshowdown.com/audio/cries/'
				}
			],
			args: [
				{
					key: 'pokemon',
					prompt: 'What Pokémon do you want to use?',
					type: 'integer',
					max: client.pokemon.pokemonCount,
					min: 0,
					default: () => Math.floor(Math.random() * (client.pokemon.pokemonCount + 1))
				}
			]
		});
	}

	async run(msg, { pokemon }) {
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
		try {
			const data = await this.client.pokemon.fetch(pokemon.toString());
			const names = data.names.map(name => name.name.toLowerCase());
			const attachment = await this.createImage(data, true);
			const answerAttachment = await this.createImage(data, false);
			const connection = msg.guild ? this.client.voice.connections.get(msg.guild.id) : null;
			if (connection) {
				connection.play(path.join(__dirname, '..', '..', 'assets', 'sounds', 'whos-that-pokemon.mp3'));
				await reactIfAble(msg, this.client.user, '🔉');
			}
			await msg.reply('**You have 15 seconds, who\'s that Pokémon?**', { files: [attachment] });
			const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
				max: 1,
				time: 15000
			});
			if (connection && data.cry) {
				if (connection.dispatcher) connection.dispatcher.end();
				connection.play(data.cry);
			}
			this.client.games.delete(msg.channel.id);
			if (!msgs.size) return msg.reply(`Time! It's **${data.name}**!`, { files: [answerAttachment] });
			const guess = msgs.first().content.toLowerCase();
			const slug = this.client.pokemon.makeSlug(guess);
			if (!names.includes(guess) && data.slug !== slug) {
				return msg.reply(`Nope! It's **${data.name}**!`, { files: [answerAttachment] });
			}
			return msg.reply(`Nice! It's **${data.name}**!`, { files: [answerAttachment] });
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async createImage(pokemon, hide) {
		const name = `${pokemon.id}${hide ? '-hidden' : ''}.png`;
		const image = await request.get(pokemon.spriteImageURL);
		const file = hide ? 'hidden' : 'show';
		const bg = await loadImage(
			path.join(__dirname, '..', '..', 'assets', 'images', 'whos-that-pokemon', `${file}.png`)
		);
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
			ctx.lineWidth = 8;
			ctx.strokeStyle = '#3c5aa6';
			ctx.strokeText(pokemon.name, 362, 158, 240);
			ctx.fillStyle = '#ffcb05';
			ctx.fillText(pokemon.name, 362, 158, 240);
		}
		return { attachment: canvas.toBuffer(), name };
	}
};
