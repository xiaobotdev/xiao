const Command = require('../../structures/Command');
const { Collection } = require('discord.js');
const { stripIndents } = require('common-tags');
const { shuffle, list, wait } = require('../../structures/Util');
const { questions, stories } = require('../../assets/json/wizard-convention');

module.exports = class WizardConventionCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'wizard-convention',
			group: 'games',
			memberName: 'wizard-convention',
			description: 'Who is the Dragon? Who is the healer? Who is the mind reader? Will the Dragon eat them all?'
		});

		this.playing = new Set();
	}

	async run(msg) { // eslint-disable-line complexity
		if (this.playing.has(msg.channel.id)) return msg.say('Only one game may be occurring per channel.');
		try {
			await msg.say('You will need at least 2 more players (at max 10), type `join game` to join the game.');
			const joined = [];
			const filter = res => {
				if (res.author.id === msg.author.id) return false;
				if (joined.includes(res.author.id)) return false;
				if (res.content.toLowerCase() === 'join game') {
					joined.push(res.author.id);
					return true;
				}
				return false;
			};
			const verify = await msg.channel.awaitMessages(filter, {
				max: 10,
				time: 30000
			});
			if (verify.size < 2) {
				this.playing.delete(msg.channel.id);
				return msg.say('Game could not be started...');
			}
			let roles = ['dragon', 'healer', 'mind reader'];
			for (let i = 0; i < (verify.size - 2); i++) roles.push(`pleb ${i + 1}`);
			roles = shuffle(roles);
			const players = new Collection();
			players.set(msg.author.id, {
				user: msg.author,
				dm: msg.author.dmChannel || await msg.author.createDM(),
				role: roles[0]
			});
			await msg.author.send(`You are ${roles[0].includes('pleb') ? 'a pleb.' : `the ${roles[0]}!`}`);
			let i = 1;
			for (const message of verify.values()) {
				players.set(message.author.id, {
					user: message.author,
					dm: message.author.dmChannel || await message.author.createDM(),
					role: roles[i]
				});
				await message.author.send(`You are ${roles[i].includes('pleb') ? 'a pleb.' : `the ${roles[i]}!`}`);
				i++;
			}
			let night = 1;
			let eaten = null;
			let healed = null;
			let win = false;
			while (players.size > 2) {
				await msg.say(`Night ${night++}... Sending DMs...`);
				for (const player of players.values()) {
					if (player.role.includes('pleb')) continue;
					const playerList = players.filter(p => p.role !== player.role).map(p => p.user.tag);
					await player.user.send(`${questions[player.role]} ${list(playerList, 'or')}?`);
					const decision = await player.dm.awaitMessages(res => playerList.includes(res.content), {
						max: 1,
						time: 30000
					});
					if (!decision.size) {
						await player.user.send('Skipping your turn...');
						continue;
					}
					const choice = decision.first().content;
					if (player.role === 'dragon') {
						const found = players.find(p => p.user.tag === choice).user.id;
						eaten = found;
						await player.user.send(`${choice} will be eaten...`);
					} else if (player.role === 'healer') {
						const found = players.find(p => p.user.tag === choice).user.id;
						healed = found;
						await player.user.send(`${choice} will be healed...`);
					} else if (player.role === 'mind reader') {
						const dragon = players.find('role', 'dragon').user.id;
						const found = players.find(p => p.user.tag === choice).user.id;
						await player.user.send(dragon === found ? 'Yes.' : 'No.');
					}
				}
				const display = eaten ? players.get(eaten).user.tag : null;
				if (eaten && eaten !== healed) {
					const found = players.find(p => p.user.id === eaten).user.id;
					players.delete(found);
				}
				const story = stories[Math.floor(Math.random() * stories.length)];
				if (eaten && eaten === healed) {
					await msg.say(stripIndents`
						Late last night, a dragon emerged and tried to eat ${display}${story}
						Thankfully, a healer stepped in just in time to save the day.
						Who is this mysterious dragon? You have one minute to argue your case.
					`);
				} else if (eaten && players.size < 3) {
					await msg.say(stripIndents`
						Late last night, a dragon emerged and devoured poor ${display}${story}
						Sadly, after the event, the final wizard ran in fear, leaving the dragon to rule forever.
					`);
					break;
				} else if (eaten && eaten !== healed) {
					await msg.say(stripIndents`
						Late last night, a dragon emerged and devoured poor ${display}${story}
						Who is this mysterious dragon? You have one minute to argue your case.
					`);
				} else {
					await msg.say(stripIndents`
						Late last night, a dragon emerged. Thankfully, however, it didn't try to eat anyone.
						Who is this mysterious dragon? You have one minute to argue your case.
					`);
				}
				await wait(60000);
				await msg.say('Time is up!');
				const voteCounts = new Collection();
				const voted = [];
				const playerList = players.map(p => p.user.tag);
				const filter2 = res => {
					if (!players.has(res.author.id)) return false;
					if (voted.includes(res.author.id)) return false;
					if (playerList.includes(res.content)) {
						voted.push(res.author.id);
						return true;
					}
					return false;
				};
				await msg.say(`Who is the dragon? ${list(playerList, 'or')}?`);
				const votes = await msg.channel.awaitMessages(filter2, { time: 30000 });
				for (const vote of votes.values()) {
					for (const player of players.values()) {
						if (vote.content !== player.user.tag) continue;
						const existing = voteCounts.get(player.user.id);
						if (existing) {
							++existing.votes;
						} else {
							voteCounts.set(player.user.id, {
								votes: 1,
								name: player.user.tag,
								id: player.user.id
							});
						}
					}
				}
				if (!voteCounts.size) {
					await msg.say('No one will be expelled.');
					continue;
				}
				const expelled = voteCounts.sort((a, b) => b.votes - a.votes).first();
				await msg.say(`${expelled.name} will be expelled.`);
				if (players.find('role', 'dragon').user.id === expelled.id) {
					win = true;
					break;
				} else {
					const found = players.find(player => player.user.id === expelled.id).user.id;
					players.delete(found);
					eaten = null;
					healed = null;
				}
			}
			this.playing.delete(msg.channel.id);
			if (win) return msg.say('The dragon is dead! Thanks for playing!');
			return msg.say('Oh no... The dragon wasn\'t caught in time... Too bad...');
		} catch (err) {
			this.playing.delete(msg.channel.id);
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
