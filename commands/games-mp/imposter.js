const Command = require('../../structures/Command');
const { stripIndents, oneLine } = require('common-tags');
const Collection = require('@discordjs/collection');
const { delay, awaitPlayers, list, reactIfAble } = require('../../util/Util');
const words = require('../../assets/json/imposter');
const { SUCCESS_EMOJI_ID } = process.env;

module.exports = class ImposterCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'imposter',
			aliases: ['among-us'],
			group: 'games-mp',
			memberName: 'imposter',
			description: 'Who is the imposter among us?',
			guildOnly: true,
			clientPermissions: ['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'],
			args: [
				{
					key: 'playersCount',
					label: 'players',
					prompt: 'How many players are you expecting to have?',
					type: 'integer',
					min: 3,
					max: 20
				}
			]
		});
	}

	async run(msg, { playersCount }) {
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
		try {
			const awaitedPlayers = await awaitPlayers(msg, playersCount, 3);
			if (!awaitedPlayers) {
				this.client.games.delete(msg.channel.id);
				return msg.say('Game could not be started...');
			}
			const word = words[Math.floor(Math.random() * words.length)];
			const wordRegex = new RegExp(`\\b${word}\\b`, 'i');
			const players = new Collection();
			const imposter = awaitedPlayers[Math.floor(Math.random() * awaitedPlayers.length)];
			await msg.say(oneLine`
				Welcome to Imposter! In this game, you will have to figure out who the imposter is!
				All you have to do is watch what other players say. There's a special word called a kill word.
				Only the imposter can say it, and if anyone else does, they die! To win, figure out what the kill
				word is, and try to catch the imposter saying it. As for the imposter, you know the word, try to get
				everyone to say it!
			`);
			for (const player of awaitedPlayers) {
				players.set(player, {
					id: player,
					user: await this.client.users.fetch(player),
					killed: false,
					imposter: imposter === player
				});
				const newPlayer = players.get(player);
				if (imposter === player) newPlayer.user.send(`You are the imposter. The kill word is ${word}.`);
				else newPlayer.user.send('You are not the imposter. Be careful what you say!');
			}
			let lastTurnTimeout = false;
			const winners = [];
			while (players.filter(player => !player.killed).size > 2) {
				const playersLeft = players.filter(player => !player.killed).size;
				await msg.say(`There are **${playersLeft}** players left. Talk until someone says the kill word.`);
				const filter = res => {
					const player = players.get(res.author.id);
					if (!player || player.killed || player.imposter) return false;
					if (res.content && wordRegex.test(res.content)) return true;
					return false;
				};
				const msgs = await msg.channel.awaitMessages(filter, {
					max: 1,
					time: 600000
				});
				if (msgs.size) {
					const killedMsg = msgs.first();
					try {
						await killedMsg.react('🔪');
					} catch {
						await killedMsg.reply('🔪');
					}
					players.get(killedMsg.author.id).killed = true;
					await msg.say(stripIndents`
						${killedMsg.author} has been murdered for saying the kill word!
						Talk amongst yourselves, who is the imposter? Voting begins in 1 minute.
					`);
				} else {
					await msg.say(stripIndents`
						No has said the word for 10 minutes. We're voting anyway! Who looks suspicious?
						Talk amongst yourselves, who is the imposter? Voting begins in 1 minute.
					`);
				}
				await delay(60000);
				const choices = players.filter(player => !player.killed);
				const ids = choices.map(player => player.id);
				let i = 0;
				await msg.say(stripIndents`
					Alright, who do you think the imposter is? You have 1 minute to vote.

					_Type the number of the player you think is the imposter._
					${choices.map(player => { i++; return `**${i}.** ${player.user.tag}`; }).join('\n')}
				`);
				const votes = new Collection();
				const voteFilter = res => {
					const player = players.get(res.author.id);
					if (!player || player.killed) return false;
					const int = Number.parseInt(res.content, 10);
					if (int >= 1 && int <= players.filter(p => !p.killed).size) {
						const currentVotes = votes.get(choices[int - 1]);
						votes.set(ids[int - 1], {
							votes: currentVotes ? currentVotes + 1 : 1,
							id: ids[int - 1]
						});
						reactIfAble(res, res.author, SUCCESS_EMOJI_ID, '✅');
						return true;
					}
					return false;
				};
				const vote = await msg.channel.awaitMessages(voteFilter, {
					max: players.filter(player => !player.killed).size,
					time: 60000
				});
				if (!vote.size) {
					if (lastTurnTimeout) {
						await msg.say('Game ended due to inactivity.');
						break;
					} else {
						await msg.say('Come on guys, get in the game!');
						lastTurnTimeout = true;
						continue;
					}
				}
				const kicked = players.get(votes.sort((a, b) => b.votes - a.votes).first().id);
				players.get(kicked.id).killed = true;
				if (kicked.id === players.find(player => player.imposter).id) {
					await msg.say(`**${kicked.user.tag}** was the imposter.`);
					winners.push(...players.filter(player => !player.killed).map(player => player.user.tag));
					break;
				}
				const amountLeft = players.filter(player => !player.killed);
				await msg.say(stripIndents`
					**${kicked.user.tag}** was not the imposter.

					${amountLeft.size > 2 ? '_Next round starts in 30 seconds._' : ''}
				`);
				if (amountLeft.size > 2) {
					await delay(30000);
				} else {
					winners.push(players.find(player => player.imposter).user.tag);
					break;
				}
			}
			this.client.games.delete(msg.channel.id);
			return msg.say(`Congrats, ${list(winners)}! The kill word was **${word}**.`);
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}
};
