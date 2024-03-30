const Command = require('../../framework/Command');
const { Util: { escapeMarkdown } } = require('discord.js');
const { stripIndents } = require('common-tags');
const { shuffle } = require('../../util/Util');
const Game = require('../../structures/cards-against-humanity/Game');
const { greenCards, redCards } = require('../../assets/json/apples-to-apples');

module.exports = class ApplesToApplesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'apples-to-apples',
			aliases: ['a2a'],
			group: 'games-mp',
			memberName: 'apples-to-apples',
			description: 'Compete to see who can come up with the best card to match an adjective.',
			guildOnly: true,
			clientPermissions: ['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'],
			credit: [
				{
					name: 'Mattel',
					url: 'https://www.mattel.com/en-us',
					reason: 'Original "Apples to Apples" Game, Card Data',
					reasonURL: 'https://www.mattelgames.com/games/en-us/family/apples-apples'
				},
				{
					name: 'JSON Against Humanity',
					url: 'https://www.crhallberg.com/cah/',
					reason: 'Card Data'
				}
			],
			flags: [
				{
					key: 'bot',
					description: 'Adds the bot as a player.'
				},
				{
					key: 'b',
					description: 'Alias for bot.'
				}
			],
			args: [
				{
					key: 'maxPts',
					label: 'awesome points',
					type: 'integer',
					max: 20,
					min: 1
				}
			]
		});
	}

	async run(msg, { maxPts, flags }) {
		const bot = flags.bot || flags.b;
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id,
			new Game(this.client, this.name, msg.channel, redCards, greenCards, 'Green'));
		const game = this.client.games.get(msg.channel.id);
		try {
			const awaitedPlayers = await game.awaitPlayers(msg, bot);
			if (!awaitedPlayers) {
				this.client.games.delete(msg.channel.id);
				return msg.say('Game could not be started...');
			}
			game.createJoinLeaveCollector(msg.channel, game);
			while (!game.winner) {
				const czar = game.changeCzar();
				for (const player of game.players.values()) {
					if (player.id === czar.id) continue;
					if (player.kickable) game.kick(player);
				}
				if (game.players.size < 3) {
					await msg.say('Oh... It looks like everyone left...');
					break;
				}
				const black = game.blackDeck.draw();
				await msg.say(stripIndents`
					The card czar will be ${czar.user}!
					The Green Card is: **${escapeMarkdown(black.text)}**

					Sending DMs...
				`);
				const chosenCards = [];
				const turns = await Promise.all(game.players.map(player => player.turn(black, chosenCards)));
				const extra = turns.reduce((a, b) => a + b);
				if (!chosenCards.length) {
					await msg.say('Hmm... No one even tried.');
					continue;
				}
				const cards = shuffle(chosenCards);
				await msg.say(stripIndents`
					${czar.user}, which card${black.pick > 1 ? 's' : ''} do you pick?
					**Green Card:** ${escapeMarkdown(black.text)}

					${cards.map((card, i) => `**${i + 1}.** ${card.cards.join(' | ')}`).join('\n')}
				`);
				const filter = res => {
					if (res.author.id !== czar.user.id) return false;
					if (!/^[0-9]+$/g.test(res.content)) return false;
					if (!cards[Number.parseInt(res.content, 10) - 1]) return false;
					return true;
				};
				const chosen = await msg.channel.awaitMessages({
					filter,
					max: 1,
					time: 120000
				});
				if (!chosen.size) {
					await msg.say('Hmm... No one wins. Dealing back cards...');
					for (const pick of cards) {
						for (const card of pick.cards) {
							/* eslint-disable max-depth */
							if (!game.players.has(pick.id)) continue;
							game.players.get(pick.id).hand.add(card);
							/* eslint-enable max-depth */
						}
					}
					game.czar.strikes++;
					continue;
				}
				const player = game.players.get(cards[Number.parseInt(chosen.first().content, 10) - 1].id);
				if (!player) {
					await msg.say('Oh no, I think that player left! No awesome points will be awarded...');
					continue;
				}
				player.points += 1 + extra;
				if (player.points >= maxPts) {
					game.winner = player.user;
				} else {
					const addS = player.points > 1 ? 's' : '';
					await msg.say(`Nice, ${player.user}! You now have **${player.points}** awesome point${addS}!`);
				}
			}
			game.stopJoinLeaveCollector();
			this.client.games.delete(msg.channel.id);
			if (!game.winner) return msg.say('See you next time!');
			return msg.say(`And the winner is... ${game.winner}! Great job!`);
		} catch (err) {
			game.stopJoinLeaveCollector();
			this.client.games.delete(msg.channel.id);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
