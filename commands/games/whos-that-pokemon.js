const { Command } = require('discord.js-commando');
const { createCanvas, loadImage } = require('canvas');
const snekfetch = require('snekfetch');
const { silhouette } = require('../../util/Canvas');

module.exports = class WhosThatPokemonCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'whos-that-pokemon',
			aliases: ['who-pokemon', 'whos-that-pokémon', 'who-pokémon'],
			group: 'games',
			memberName: 'whos-that-pokemon',
			description: 'Guess who that Pokémon is.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'hide',
					prompt: 'Do you want to silhouette the Pokémon\'s image?',
					type: 'boolean',
					default: false
				}
			]
		});

		this.cache = new Map();
	}

	async run(msg, { hide }) {
		const pokemon = Math.floor(Math.random() * 802) + 1;
		try {
			const data = await this.fetchPokemon(pokemon);
			const names = data.names.map(name => name.name.toLowerCase());
			const displayName = data.names.filter(name => name.language.name === 'en')[0].name;
			const id = data.id.toString().padStart(3, '0');
			const attachment = await this.fetchImage(id, hide);
			await msg.say('**You have 15 seconds, who\'s that Pokémon?**', { files: [{ attachment, name: `${id}.png` }] });
			const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
				max: 1,
				time: 15000
			});
			if (!msgs.size) return msg.say(`Sorry, time is up! It was ${displayName}.`);
			if (!names.includes(msgs.first().content.toLowerCase())) return msg.say(`Nope, sorry, it's ${displayName}.`);
			return msg.say('Nice job! 10/10! You deserve some cake!');
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchPokemon(pokemon) {
		if (this.cache.has(pokemon)) return this.cache.get(pokemon);
		const { body } = await snekfetch.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}/`);
		this.cache.set(body.id, body);
		return body;
	}

	async fetchImage(id, hide = false) {
		const image = await snekfetch.get(`https://www.serebii.net/sunmoon/pokemon/${id}.png`);
		if (!hide) return image.body;
		const base = await loadImage(image.body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		silhouette(ctx, 0, 0, base.width, base.height);
		return canvas.toBuffer();
	}
};
