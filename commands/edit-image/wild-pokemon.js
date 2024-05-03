const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');
const { centerImagePart, greyscale, pixelize } = require('../../util/Canvas');

module.exports = class WildPokemonCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'wild-pokemon',
			aliases: ['wild-pokemon-appears', 'wild-appears', 'wild-pokémon', 'wild-pokémon-appears', 'wild-pkmn'],
			group: 'edit-image',
			memberName: 'wild-pokemon',
			description: 'Draws an image or a user\'s avatar over a wild Pokémon appearance.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Pokémon',
					url: 'https://www.pokemon.com/us/',
					reason: 'Image, Original Game'
				},
				{
					name: 'Jackster Productions',
					url: 'https://www.fontspace.com/jackster-productions',
					reason: 'Pokemon GB Font',
					reasonURL: 'https://www.fontspace.com/pokemon-gb-font-f9621'
				}
			],
			args: [
				{
					key: 'name',
					type: 'string',
					max: 9
				},
				{
					key: 'image',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 128 })
				}
			]
		});
	}

	async run(msg, { name, image }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'wild-pokemon.png'));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		const { x, y, width, height } = centerImagePart(data, 100, 100, 227, 11);
		pixelize(ctx, canvas, data, 0.30, x, y, width, height);
		greyscale(ctx, x, y, width, height);
		ctx.letterSpacing = '2px';
		ctx.textBaseline = 'top';
		ctx.font = this.client.fonts.get('PokemonGb.ttf').toCanvasString(16);
		ctx.fillText(name.toUpperCase(), 106, 205, 215);
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'wild-pokemon.png' }] });
	}
};
