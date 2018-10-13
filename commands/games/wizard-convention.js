const Command = require('../../structures/Command');
const { Collection } = require('discord.js');
const { stripIndents } = require('common-tags');
const { shuffle, delay, awaitPlayers } = require('../../util/Util');
const { questions, stories } = require('../../assets/json/wizard-convention');

module.exports = class WizardConventionCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'wizard-convention',
			aliases: ['wiz-convention'],
			group: 'games',
			memberName: 'wizard-convention',
			description: 'Who is the Dragon? Who is the healer? Who is the mind reader? Will the Dragon eat them all?',
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
			while (players.size > 2 && players.some(p => p.role === 'dragon')) {
				let eaten = null;
				let healed = null;
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
					if (player.role === 'dragon') {
						const chosen = players.get(choice);
						eaten = chosen.id;
						await player.user.send(`${chosen.user.tag} will be eaten...`);
					} else if (player.role === 'healer') {
						const chosen = players.get(choice);
						healed = chosen.id;
						await player.user.send(`${chosen.user.tag} will be healed...`);
					} else if (player.role === 'mind reader') {
						await player.user.send(players.find(p => p.role === 'dragon').id === choice ? 'Yes.' : 'No.');
					}
				}
				const display = eaten ? players.get(eaten).user : null;
				const story = stories[Math.floor(Math.random() * stories.length)];
				if (eaten && eaten === healed) {
					await msg.say(stripIndents`
						Late last night, a dragon emerged and tried to eat ${display}${story}
						Thankfully, a healer stepped in just in time to save the day.
						Who is this mysterious dragon? You have one minute to decide.
					`);
				} else if (eaten && players.size < 3) {
					await msg.say(stripIndents`
						Late last night, a dragon emerged and devoured poor ${display}${story}
						Sadly, after the event, the final wizard ran in fear, leaving the dragon to rule forever.
					`);
					break;
				} else if (eaten && eaten !== healed) {
					players.delete(eaten);
					await msg.say(stripIndents`
						Late last night, a dragon emerged and devoured poor ${display}${story}
						Who is this mysterious dragon? You have one minute to decide.
					`);
				} else {
					await msg.say(stripIndents`
						Late last night, a dragon emerged. Thankfully, however, it didn't try to eat anyone.
						Who is this mysterious dragon? You have one minute to decide.
					`);
				}
				await delay(60000);
				const playersArr = Array.from(players.values());
				await msg.say(stripIndents`
					Who do you think is the dragon? Please type the number.
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
					await msg.say('No one will be expelled.');
					continue;
				}
				const expelled = this.getExpelled(votes, players, playersArr);
				await msg.say(`${expelled.user} will be expelled.`);
				players.delete(expelled.id);
				++turn;
			}
			this.playing.delete(msg.channel.id);
			const dragon = players.find(p => p.role === 'dragon');
			if (!dragon) return msg.say('The dragon has been vanquished! Thanks for playing!');
			return msg.say(`Oh no, the dragon wasn't caught in time... Nice job, ${dragon.user}!`);
		} catch (err) {
			this.playing.delete(msg.channel.id);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async generatePlayers(list) {
		let roles = ['dragon', 'healer', 'mind reader'];
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

	getExpelled(votes, players, playersArr) {
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
