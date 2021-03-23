const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const { greyscale } = require('../../util/Canvas');
const path = require('path');
const advantages = require('../../assets/json/pokemon-advantage');

module.exports = class PokemonAdvantageCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pokemon-advantage',
			aliases: ['pokemon-adv', 'pokémon-advantage', 'pokémon-adv', 'pkmn-advantage', 'pkmn-adv'],
			group: 'games-sp',
			memberName: 'pokemon-advantage',
			description: 'Guess which Pokémon has the type advantage.',
			throttling: {
				usages: 2,
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
					name: 'Shutterstock',
					url: 'https://www.shutterstock.com/',
					reason: 'Background Image',
					reasonURL: 'https://www.shutterstock.com/video/search/anime-zoom'
				},
				{
					name: 'United States Judo Federation',
					url: 'https://www.usjf.com/',
					reason: 'Stars Image',
					reasonURL: 'https://www.usjf.com/2019/11/five-star-dojo-program/'
				},
				{
					name: 'DaFont',
					url: 'https://www.dafont.com/',
					reason: 'Pokemon Solid Font',
					reasonURL: 'https://www.dafont.com/pokemon.font'
				},
				{
					name: 'wavebeem',
					url: 'https://github.com/wavebeem',
					reason: 'Type Advantage Data',
					reasonURL: 'https://github.com/wavebeem/pkmn.help/blob/master/src/data.ts'
				}
			]
		});
	}

	async run(msg) {
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
		try {
			const num1 = Math.floor(Math.random() * (this.client.pokemon.pokemonCount + 1));
			const pkmn1 = await this.client.pokemon.fetch(num1);
			const num2 = Math.floor(Math.random() * (this.client.pokemon.pokemonCount + 1));
			const pkmn2 = await this.client.pokemon.fetch(num2);
			await pkmn1.fetchDefaultVariety();
			await pkmn2.fetchDefaultVariety();
			const attachment = await this.createImage(pkmn1, pkmn2, null);
			const answer = this.calculateAdvantage(pkmn1, pkmn2);
			const answerAttachment = await this.createImage(pkmn1, pkmn2, answer);
			await msg.reply(stripIndents`
				**You have 15 seconds, who\'s got the type advantage?**
				_If the Pokémon are evenly matched, type \`even\`._
			`, { files: [attachment] });
			const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
				max: 1,
				time: 15000
			});
			this.client.games.delete(msg.channel.id);
			if (!msgs.size) return msg.reply(`Time! It's **${answer.name}**!`, { files: [answerAttachment] });
			const guess = msgs.first().content.toLowerCase();
			const slug = this.client.pokemon.makeSlug(guess);
			if (answer === true) {
				if (guess === 'even') return msg.reply('Nice! These two are even!', { files: [answerAttachment] });
				return msg.reply('Nope! These two are even!', { files: [answerAttachment] });
			}
			if (!answer.names.includes(guess) && answer.slug !== slug) {
				return msg.reply(`Nope! It's **${answer.name}**!`, { files: [answerAttachment] });
			}
			return msg.reply(`Nice! It's **${answer.name}**!`, { files: [answerAttachment] });
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async createImage(pokemon1, pokemon2, winner) {
		const name = `${pokemon1.id}${pokemon2.id}-${winner ? winner.id : 'none'}.png`;
		const image1 = await request.get(pokemon1.spriteImageURL);
		const image2 = await request.get(pokemon2.spriteImageURL);
		const bg = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'pokemon-advantage', 'bg.png'));
		const pkmn1 = await loadImage(image1.body);
		const pkmn2 = await loadImage(image2.body);
		const canvas = createCanvas(bg.width, bg.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(bg, 0, 0);
		if (winner) {
			const stars = await loadImage(
				path.join(__dirname, '..', '..', 'assets', 'images', 'pokemon-advantage', 'stars.png')
			);
			if (winner === true) {
				ctx.drawImage(stars, 20, 0, 200, 200);
				ctx.drawImage(stars, 250, 0, 200, 200);
				ctx.drawImage(pkmn1, 41, 12, 175, 175);
				ctx.drawImage(pkmn2, 261, 12, 175, 175);
			} else if (winner.id === pokemon1.id) {
				ctx.drawImage(stars, 20, 0, 200, 200);
				const greyCanvas = createCanvas(pkmn2.width, pkmn2.height);
				const greyCtx = greyCanvas.getContext('2d');
				greyCtx.drawImage(pkmn2, 0, 0);
				greyscale(greyCtx, 0, 0, pkmn2.width, pkmn2.height);
				ctx.drawImage(greyCanvas, 261, 12, 175, 175);
				ctx.drawImage(pkmn1, 41, 12, 175, 175);
			} else if (winner.id === pokemon2.id) {
				ctx.drawImage(stars, 250, 0, 200, 200);
				const greyCanvas = createCanvas(pkmn1.width, pkmn1.height);
				const greyCtx = greyCanvas.getContext('2d');
				greyCtx.drawImage(pkmn1, 0, 0);
				greyscale(greyCtx, 0, 0, pkmn1.width, pkmn1.height);
				ctx.drawImage(greyCanvas, 41, 12, 175, 175);
				ctx.drawImage(pkmn2, 261, 12, 175, 175);
			}
		} else {
			ctx.drawImage(pkmn1, 41, 12, 175, 175);
			ctx.drawImage(pkmn2, 261, 12, 175, 175);
		}
		ctx.font = this.client.fonts.get('Pokemon Solid.ttf').toCanvasString(30);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'bottom';
		ctx.lineWidth = 8;
		ctx.strokeStyle = '#3c5aa6';
		ctx.fillStyle = '#ffcb05';
		ctx.strokeText(pokemon1.name, 128, 250, 175);
		ctx.fillText(pokemon1.name, 128, 250, 175);
		ctx.strokeText(pokemon2.name, 348, 250, 175);
		ctx.fillText(pokemon2.name, 348, 250, 175);
		return { attachment: canvas.toBuffer(), name };
	}

	calculateAdvantage(pkmn1, pkmn2) {
		if (pkmn1.id === pkmn2.id) return null;
		if (pkmn1.missingno) return pkmn1;
		if (pkmn2.missingno) return pkmn2;
		const types1 = pkmn1.varieties.find(variety => variety.default).types;
		const types2 = pkmn2.varieties.find(variety => variety.default).types;
		if (types1[0] === types2[0] && types1[1] === types2[1]) return true;
		const firstEffectives1 = advantages.data[types1[0]];
		const firstEffectives2 = types1[1] ? advantages.data[types1[1]] : null;
		const secndEffectives1 = advantages.data[types2[0]];
		const secndEffectives2 = types2[1] ? advantages.data[types2[1]] : null;
		let firstResult = 0;
		let secndResult = 0;
		firstResult += this.calculateSingleAdvantage(types2, firstEffectives1);
		if (firstEffectives2) {
			firstResult += this.calculateSingleAdvantage(types2, firstEffectives2);
		} else {
			firstResult += this.calculateSingleAdvantage(types2, firstEffectives1);
		}
		secndResult += this.calculateSingleAdvantage(types1, secndEffectives1);
		if (secndEffectives2) {
			secndResult += this.calculateSingleAdvantage(types1, secndEffectives2);
		} else {
			secndResult += this.calculateSingleAdvantage(types1, secndEffectives1);
		}
		if (firstResult === secndResult) return true;
		return firstResult > secndResult ? pkmn1 : pkmn2;
	}

	calculateSingleAdvantage(types, advs) {
		const x1 = advs[advantages.types.indexOf(types[0])];
		const x2 = types[1] ? advs[advantages.types.indexOf(types[1])] : 1;
		return x1 * x2;
	}
};
