const Command = require('../../structures/Command');
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
			memberName: 'tarot',
			description: 'Provides a fortune using Tarot cards.',
			args: [
				{
					key: 'question',
					prompt: 'What question should the tarot reading answer?',
					type: 'string',
					max: 50
				}
			]
		});
	}

	async run(msg, { question }) {
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
		try {
			const deck = new TarotDeck();
			const cards = deck.draw(3);
			for (let i = 0; i < cards.length; i++) {
				const card = cards[i];
				await msg.say(stripIndents`
					Your ${displayNums[i]} card is **${card.name}**.
					This card is often associated with words like **${list(card.keywords)}**.

					One common meaning for this card is **${card.randomLightMeaning()}**.
					However, beware, as it could also mean **${card.randomShadowMeaning()}**.

					Would you like me to keep going? Type **[y]es** or **[n]o**.
				`, { files: [card.imagePath] });
				const verification = await verify(msg.channel, msg.author);
				if (!verification) break;
			}
			this.client.games.delete(msg.channel.id);
			return msg.say(stripIndents`
				To finish with a recap, you asked the question: **${escapeMarkdown(question)}**

				In response, the following cards were drawn:
				- ${cards.map(card => `${card.name} (${card.keywords.join(', ')})`).join('\n- ')}

				I hope this gives you a good idea of what the future holds...
			`);
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}
};
