const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const { reactIfAble } = require('../../util/Util');
const { silhouette, centerImagePart } = require('../../util/Canvas');
const path = require('path');

module.exports = class WhosThatPokemonCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'whos-that-pokemon',
			aliases: ['who-pokemon', 'whos-that-pokémon', 'who-pokémon', 'who-pkmn'],
			group: 'games-sp',
			memberName: 'whos-that-pokemon',
			description: 'Guess who that Pokémon is, based on their silhouette.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			game: true,
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
					reason: 'Cry Sound Effects (Gen 8-9)',
					reasonURL: 'https://www.sounds-resource.com/nintendo_switch/pokemonswordshield/'
				},
				{
					name: 'Pokémon Showdown',
					url: 'https://play.pokemonshowdown.com/',
					reason: 'Cry Sound Effects (Meltan and Melmetal, Legends: Arceus)',
					reasonURL: 'https://play.pokemonshowdown.com/audio/cries/'
				}
			],
			args: [
				{
					key: 'pokemon',
					type: 'integer',
					max: client.pokemon.pokemonCount,
					min: 0,
					default: () => Math.floor(Math.random() * (client.pokemon.pokemonCount + 1))
				}
			]
		});
	}

	async run(msg, { pokemon }) {
		const data = await this.client.pokemon.fetch(pokemon.toString());
		const names = data.names.map(name => name.name.toLowerCase());
		const attachment = await this.createImage(data, true);
		const answerAttachment = await this.createImage(data, false);
		const connection = msg.guild ? this.client.dispatchers.get(msg.guild.id) : null;
		if (msg.guild && connection && connection.canPlay) {
			connection.play(path.join(__dirname, '..', '..', 'assets', 'sounds', 'whos-that-pokemon.mp3'));
			await reactIfAble(msg, this.client.user, '🔉');
		}
		await msg.reply('**You have 15 seconds, who\'s that Pokémon?**', { files: [attachment] });
		const msgs = await msg.channel.awaitMessages({
			filter: res => res.author.id === msg.author.id,
			max: 1,
			time: 15000
		});
		if (connection && data.cry) connection.play(data.cry);
		if (!msgs.size) return msg.reply(`Time! It's **${data.name}**!`, { files: [answerAttachment] });
		const guess = msgs.first().content.toLowerCase();
		const slug = this.client.pokemon.makeSlug(guess);
		if (!names.includes(guess) && data.slug !== slug) {
			return msg.reply(`Nope! It's **${data.name}**!`, { files: [answerAttachment] });
		}
		return msg.reply(`Nice! It's **${data.name}**!`, { files: [answerAttachment] });
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
		const silhouetteCanvas = createCanvas(pkmn.width, pkmn.height);
		const silhouetteCtx = silhouetteCanvas.getContext('2d');
		silhouetteCtx.drawImage(pkmn, 0, 0);
		silhouette(silhouetteCtx, 0, 0, pkmn.width, pkmn.height);
		const { x, y, width, height } = centerImagePart(pkmn, 200, 200, 30, 39);
		if (hide) {
			ctx.globalAlpha = 0.5;
			ctx.drawImage(silhouetteCanvas, x - 5, y + 5, width, height);
			ctx.globalAlpha = 1;
			ctx.drawImage(silhouetteCanvas, x, y, width, height);
		} else {
			ctx.globalAlpha = 0.5;
			ctx.drawImage(silhouetteCanvas, x - 5, y + 5, width, height);
			ctx.globalAlpha = 1;
			ctx.drawImage(pkmn, x, y, width, height);
			ctx.font = this.client.fonts.get('Pokemon Solid.ttf').toCanvasString(60);
			ctx.textAlign = 'center';
			ctx.textBaseline = 'bottom';
			ctx.lineWidth = 8;
			ctx.strokeStyle = 'black';
			ctx.globalAlpha = 0.5;
			ctx.strokeText(pokemon.name, 357, 163, 240);
			ctx.globalAlpha = 1;
			ctx.strokeStyle = '#ffcb05';
			ctx.strokeText(pokemon.name, 362, 158, 240);
			ctx.fillStyle = '#3c5aa6';
			ctx.fillText(pokemon.name, 362, 158, 240);
		}
		return { attachment: canvas.toBuffer(), name };
	}
};
