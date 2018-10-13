const Command = require('../../structures/Command');
const { Collection } = require('discord.js');
const { stripIndents } = require('common-tags');
const { shuffle, delay, awaitPlayers } = require('../../util/Util');
const { questions, stories } = require('../../assets/json/mafia');

module.exports = class MafiaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'mafia',
			aliases: ['town-of-salem', 'werewolf'],
			group: 'games',
			memberName: 'mafia',
			description: 'Who is the Mafia? Who is the doctor? Who is the detective? Will the Mafia kill them all?',
			guildOnly: true
		});

		this.playing = new Set();
	}

	async run(msg) { // eslint-disable-line complexity
		if (this.playing.has(msg.channel.id)) return msg.reply('Only one game may be occurring per channel.');
		this.playing.add(msg.channel.id);
		try {
			await msg.say('You will need at least 2 more players, at maximum 10. To join, type `join game`.');
			const awaitedPlayers = await awaitPlayers(msg, 10, 3, { dmCheck: true });
			if (!awaitedPlayers) {
				this.playing.delete(msg.channel.id);
				return msg.say('Game could not be started...');
			}
			const players = await this.generatePlayers(awaitedPlayers);
			let turn = 1;
			while (players.size > 2 && players.some(p => p.role === 'mafia')) {
				let killed = null;
				let saved = null;
				await msg.say(`Night ${turn}, sending DMs...`);
				for (const player of players.values()) {
					if (player.role.includes('pleb')) continue;
					await msg.say(`The ${player.role} is making their decision...`);
					const valid = players.filterArray(p => p.role !== player.role);
					await player.user.send(stripIndents`
						${questions[player.role]} Please type the number.
						${valid.map((p, i) => `**${i + 1}.** ${p.user.tag}`).join('\n')}
					`);
					const filter = res => valid[Number.parseInt(res.content, 10) - 1];
					const decision = await player.user.dmChannel.awaitMessages(filter, {
						max: 1,
						time: 120000
					});
					if (!decision.size) {
						await player.user.send('Sorry, time is up!');
						continue;
					}
					const choice = Number.parseInt(decision.first().content, 10);
					if (player.role === 'mafia') {
						const chosen = players.get(choice);
						killed = chosen.id;
						await player.user.send(`${chosen.user.tag} will be killed...`);
					} else if (player.role === 'doctor') {
						const chosen = players.get(choice);
						saved = chosen.id;
						await player.user.send(`${chosen.user.tag} will be saved...`);
					} else if (player.role === 'detective') {
						await player.user.send(players.find(p => p.role === 'mafia').id === choice ? 'Yes.' : 'No.');
					}
				}
				const display = killed ? players.get(killed).user : null;
				const story = stories[Math.floor(Math.random() * stories.length)];
				if (killed && killed === saved) {
					await msg.say(stripIndents`
						Late last night, a Mafia member emerged from the dark and tried to kill ${display}${story}
						Thankfully, a doctor stepped in just in time to save the day.
						Who is this mysterious Mafia member? You have one minute to decide.
					`);
				} else if (killed && players.size < 3) {
					await msg.say(stripIndents`
						Late last night, a Mafia member emerged from the dark and killed poor ${display}${story}
						Sadly, after the event, the final citizen left the town in fear, leaving the Mafia to rule forever.
					`);
					break;
				} else if (killed && killed !== saved) {
					players.delete(killed);
					await msg.say(stripIndents`
						Late last night, a Mafia member emerged from the dark and killed poor ${display}${story}
						Who is this mysterious Mafia member? You have one minute to decide.
					`);
				} else {
					await msg.say(stripIndents`
						Late last night, a Mafia member emerged from the dark. Thankfully, however, they didn't try to kill anyone.
						Who is this mysterious Mafia member? You have one minute to decide.
					`);
				}
				await delay(60000);
				const playersArr = Array.from(players.values());
				await msg.say(stripIndents`
					Who do you think is the Mafia member? Please type the number.
					${playersArr.map((p, i) => `**${i + 1}.** ${p.user.tag}`).join('\n')}
				`);
				const voted = [];
				const filter = res => {
					if (!players.exists(p => p.user.id === res.author.id)) return false;
					if (voted.includes(res.author.id)) return false;
					if (!playersArr[Number.parseInt(res.content, 10) - 1]) return false;
					voted.push(res.author.id);
					return true;
				};
				const votes = await msg.channel.awaitMessages(filter, {
					max: players.size,
					time: 120000
				});
				if (!votes.size) {
					await msg.say('No one will be hanged.');
					continue;
				}
				const hanged = this.getHanged(votes, players, playersArr);
				await msg.say(`${hanged.user} will be hanged.`);
				players.delete(hanged.id);
				++turn;
			}
			this.playing.delete(msg.channel.id);
			const mafia = players.find(p => p.role === 'mafia');
			if (!mafia) return msg.say('The Mafia has been hanged! Thanks for playing!');
			return msg.say(`Oh no, the Mafia wasn't caught in time... Nice job, ${mafia.user}!`);
		} catch (err) {
			this.playing.delete(msg.channel.id);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async generatePlayers(list) {
		let roles = ['mafia', 'doctor', 'detective'];
		for (let i = 0; i < (list.length - 2); i++) roles.push(`pleb ${i + 1}`);
		roles = shuffle(roles);
		const players = new Collection();
		let i = 0;
		for (const user of list) {
			players.set(user.id, {
				id: user.id,
				user,
				role: roles[i]
			});
			await user.send(`Your role will be: ${roles[i]}!`);
			i++;
		}
	}

	getHanged(votes, players, playersArr) {
		const counts = new Collection();
		for (const vote of votes.values()) {
			const player = players.get(playersArr[Number.parseInt(vote.content, 10) - 1].id);
			if (counts.has(player.id)) {
				++counts.get(player.id).votes;
			} else {
				counts.set(player.id, {
					id: player.id,
					votes: 1,
					user: player.user
				});
			}
		}
		return counts.sort((a, b) => b.votes - a.votes).first();
	}
};
