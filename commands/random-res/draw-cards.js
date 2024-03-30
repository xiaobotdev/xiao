const Command = require('../../framework/Command');
const Deck = require('../../structures/cards/Deck');

module.exports = class DrawCardsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'draw-cards',
			aliases: ['draw-hand'],
			group: 'random-res',
			memberName: 'draw-cards',
			description: 'Draws a random hand of playing cards.',
			flags: [
				{
					key: 'jokers',
					description: 'Includes jokers in the deck.'
				},
				{
					key: 'j',
					description: 'Alias for bot.'
				}
			],
			args: [
				{
					key: 'amount',
					label: 'hand size',
					prompt: 'How many cards do you want to draw?',
					type: 'integer',
					max: 10,
					min: 1
				}
			]
		});
	}

	run(msg, { amount, flags }) {
		const deck = new Deck({ includeJokers: Boolean(flags.jokers || flags.j) });
		const cards = deck.draw(amount);
		const display = Array.isArray(cards) ? cards.map(c => c.display).join('\n') : cards.display;
		return msg.reply(`${amount === 1 ? '' : '\n'}${display}`);
	}
};
