const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
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
	}

	async run(msg, { hide }) {
		const pokemon = Math.floor(Math.random() * 802) + 1;
		try {
			const data = await this.client.pokemon.fetch(pokemon.toString());
			const names = data.names.map(name => name.name.toLowerCase());
			const attachment = await this.fetchImage(data, hide);
			await msg.reply('**You have 15 seconds, who\'s that Pokémon?**', { files: [attachment] });
			const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
				max: 1,
				time: 15000
			});
			if (!msgs.size) return msg.reply(`Sorry, time is up! It was ${data.name}.`);
			if (!names.includes(msgs.first().content.toLowerCase())) return msg.reply(`Nope, sorry, it's ${data.name}.`);
			return msg.reply('Nice job! 10/10! You deserve some cake!');
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchImage(pokemon, hide = false) {
		const name = `${pokemon.id}.png`;
		const image = await request.get(pokemon.spriteImageURL);
		if (!hide) return { attachment: image.body, name };
		const base = await loadImage(image.body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		silhouette(ctx, 0, 0, base.width, base.height);
		return { attachment: canvas.toBuffer(), name };
	}
};
