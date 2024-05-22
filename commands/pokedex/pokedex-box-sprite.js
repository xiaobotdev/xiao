const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas } = require('@napi-rs/canvas');
const { cropToContent } = require('../../util/Canvas');

module.exports = class PokedexBoxSpriteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pokedex-box-sprite',
			aliases: [
				'pokemon-box-sprite',
				'pokémon-box-sprite',
				'pokédex-box-sprite',
				'pkmn-box-sprite',
				'pokedex-box-image',
				'pokedex-box-image',
				'pokémon-box-image',
				'pokemon-box-image',
				'pokédex-box-image',
				'pkmn-box-image',
				'pokedex-box-img',
				'pokémon-box-img',
				'pokemon-box-img',
				'pokédex-box-img',
				'pkmn-box-img',
				'pokedex-box',
				'pokemon-box',
				'pokémon-box',
				'pokédex-box',
				'pkmn-box'
			],
			group: 'pokedex',
			description: 'Responds with the box sprite of a Pokémon.',
			clientPermissions: [PermissionFlagsBits.AttachFiles],
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
					name: 'Pokémon Showdown',
					url: 'https://play.pokemonshowdown.com/',
					reason: 'Box Sprite Sheet',
					reasonURL: 'https://play.pokemonshowdown.com/sprites/'
				}
			],
			flags: [
				{
					key: 'small',
					description: 'Generates the image with the original 40x30 size.'
				},
				{
					key: 's',
					description: 'Alias for small.'
				}
			],
			args: [
				{
					key: 'pokemon',
					type: 'pokemon'
				}
			]
		});
	}

	async run(msg, { pokemon, flags }) {
		if (!this.client.pokemon.sprites) await this.client.pokemon.loadSprites();
		const canvas = createCanvas(250, 250);
		const ctx = canvas.getContext('2d');
		let attachment;
		if (flags.small || flags.s) {
			attachment = await pokemon.generateBoxImage();
		} else {
			const x = 40 * (pokemon.id % 12);
			const y = Math.floor(pokemon.id / 12) * 30;
			ctx.imageSmoothingEnabled = false;
			const ratio = 250 / 40;
			const height = 30 * ratio;
			ctx.drawImage(this.client.pokemon.sprites, x, y, 40, 30, 0, 0, 250, height);
			cropToContent(ctx, canvas, canvas.width, canvas.height);
			attachment = canvas.toBuffer('image/png');
		}
		return msg.say(`#${pokemon.displayID} - ${pokemon.name}`, { files: [{ attachment, name: 'box.png' }] });
	}
};
