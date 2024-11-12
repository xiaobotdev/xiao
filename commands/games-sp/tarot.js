const Command = require('../../framework/Command');
const { escapeMarkdown } = require('discord.js');
const { stripIndents } = require('common-tags');
const { list, verify } = require('../../util/Util');
const TarotDeck = require('../../structures/tarot/TarotDeck');
const displayNums = ['first', 'second', 'final'];

module.exports = class TarotCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tarot',
			aliases: ['tarot-reading'],
			group: 'games-sp',
			description: 'Provides a fortune using Tarot cards.',
			game: true,
			credit: [
				{
					name: 'dariusk',
					url: 'https://github.com/dariusk',
					reason: 'Tarot Reading Data',
					reasonURL: 'https://github.com/dariusk/corpora/blob/master/data/divination/tarot_interpretations.json'
				},
				{
					name: 'Tarot Card Meanings',
					url: 'https://www.tarotcardmeanings.net/',
					reason: 'Images',
					reasonURL: 'https://www.tarotcardmeanings.net/tarotcards.htm'
				},
				{
					name: 'Ask.Cards',
					url: 'http://askthecards.info/',
					reason: '"Happy Squirrel" Card Reading and Image',
					reasonURL: 'http://askthecards.info/tarot_card_meanings/the_happy_squirrel.shtml'
				},
				{
					name: '20th Century Fox',
					url: 'https://www.foxmovies.com/',
					reason: 'Original "The Simpsons" Show, "Happy Squirrel" Concept',
					reasonURL: 'http://www.simpsonsworld.com/'
				}
			],
			args: [
				{
					key: 'question',
					type: 'string',
					max: 50
				}
			]
		});
	}

	async run(msg, { question }) {
		const deck = new TarotDeck();
		const cards = deck.draw(3);
		for (let i = 0; i < cards.length; i++) {
			const card = cards[i];
			await msg.say(stripIndents`
				Your ${displayNums[i]} card is **${card.name}**.
				This card is often associated with words like **${list(card.keywords)}**.

				One common meaning for this card is **${card.randomLightMeaning()}**.
				However, beware, as it could also mean **${card.randomShadowMeaning()}**.

				Would you like me to keep going? Reply with **[y]es** or **[n]o**.
			`, { files: [card.imagePath] });
			const verification = await verify(msg.channel, msg.author);
			if (!verification) break;
		}
		return msg.say(stripIndents`
			To finish with a recap, you asked the question: **${escapeMarkdown(question)}**

			In response, the following cards were drawn:
			- ${cards.map(card => `${card.name} (${card.keywords.join(', ')})`).join('\n- ')}

			I hope this gives you a good idea of what the future holds...
		`);
	}
};
