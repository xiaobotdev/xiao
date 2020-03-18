const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { shuffle, verify } = require('../../util/Util');
const suits = ['♣', '♥', '♦', '♠'];
const faces = ['Jack', 'Queen', 'King'];

module.exports = class BlackjackCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'blackjack',
			aliases: ['twenty-one', '21', 'bj'],
			group: 'games-sp',
			memberName: 'blackjack',
			description: 'Play a game of blackjack.',
			args: [
				{
					key: 'deckCount',
					label: 'amount of decks',
					prompt: 'How many decks do you want to use?',
					type: 'integer',
					default: 1,
					max: 8,
					min: 1
				}
			]
		});
	}

	async run(msg, { deckCount }) { // eslint-disable-line complexity
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		try {
			this.client.games.set(msg.channel.id, { name: this.name, data: this.generateDeck(deckCount) });
			const dealerHand = [];
			this.draw(msg.channel, dealerHand);
			this.draw(msg.channel, dealerHand);
			const playerHand = [];
			this.draw(msg.channel, playerHand);
			this.draw(msg.channel, playerHand);
			const dealerInitialTotal = this.calculate(dealerHand);
			const playerInitialTotal = this.calculate(playerHand);
			if (dealerInitialTotal === 21 && playerInitialTotal === 21) {
				this.client.games.delete(msg.channel.id);
				return msg.say('Well, both of you just hit blackjack. Right away. Rigged.');
			} else if (dealerInitialTotal === 21) {
				this.client.games.delete(msg.channel.id);
				return msg.say('Ouch, the dealer hit blackjack right away! Try again!');
			} else if (playerInitialTotal === 21) {
				this.client.games.delete(msg.channel.id);
				return msg.say('Wow, you hit blackjack right away! Lucky you!');
			}
			let playerTurn = true;
			let win = false;
			let reason;
			while (!win) {
				if (playerTurn) {
					await msg.say(stripIndents`
						**First Dealer Card:** ${dealerHand[0].display}

						**You (${this.calculate(playerHand)}):**
						${playerHand.map(card => card.display).join('\n')}

						_Hit?_
					`);
					const hit = await verify(msg.channel, msg.author);
					if (hit) {
						const card = this.draw(msg.channel, playerHand);
						const total = this.calculate(playerHand);
						if (total > 21) {
							reason = `You drew ${card.display}, total of ${total}! Bust`;
							break;
						} else if (total === 21) {
							reason = `You drew ${card.display} and hit 21`;
							win = true;
						}
					} else {
						const dealerTotal = this.calculate(dealerHand);
						await msg.say(`Second dealer card is ${dealerHand[1].display}, total of ${dealerTotal}.`);
						playerTurn = false;
					}
				} else {
					const inital = this.calculate(dealerHand);
					let card;
					if (inital < 17) card = this.draw(msg.channel, dealerHand);
					const total = this.calculate(dealerHand);
					if (total > 21) {
						reason = `Dealer drew ${card.display}, total of ${total}! Dealer bust`;
						win = true;
					} else if (total >= 17) {
						const playerTotal = this.calculate(playerHand);
						if (total === playerTotal) {
							reason = `${card ? `Dealer drew ${card.display}, making it ` : ''}${playerTotal}-${total}`;
							break;
						} else if (total > playerTotal) {
							reason = `${card ? `Dealer drew ${card.display}, making it ` : ''}${playerTotal}-**${total}**`;
							break;
						} else {
							reason = `${card ? `Dealer drew ${card.display}, making it ` : ''}**${playerTotal}**-${total}`;
							win = true;
						}
					} else {
						await msg.say(`Dealer drew ${card.display}, total of ${total}.`);
					}
				}
			}
			this.client.games.delete(msg.channel.id);
			if (win) return msg.say(`${reason}! You won!`);
			return msg.say(`${reason}! Too bad.`);
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}

	generateDeck(deckCount) {
		const deck = [];
		for (let i = 0; i < deckCount; i++) {
			for (const suit of suits) {
				deck.push({
					value: 11,
					display: `${suit} Ace`
				});
				for (let j = 2; j <= 10; j++) {
					deck.push({
						value: j,
						display: `${suit} ${j}`
					});
				}
				for (const face of faces) {
					deck.push({
						value: 10,
						display: `${suit} ${face}`
					});
				}
			}
		}
		return shuffle(deck);
	}

	draw(channel, hand) {
		const deck = this.client.games.get(channel.id).data;
		const card = deck[0];
		deck.shift();
		hand.push(card);
		return card;
	}

	calculate(hand) {
		return hand.sort((a, b) => a.value - b.value).reduce((a, b) => {
			let { value } = b;
			if (value === 11 && a + value > 21) value = 1;
			return a + value;
		}, 0);
	}
};
