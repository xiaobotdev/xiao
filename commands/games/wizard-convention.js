const { Command } = require('discord.js-commando');
const { Collection } = require('discord.js');
const { stripIndents } = require('common-tags');
const { shuffle, wait } = require('../../util/Util');
const { questions, stories } = require('../../assets/json/wizard-convention');

module.exports = class WizardConventionCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'wizard-convention',
			group: 'games',
			memberName: 'wizard-convention',
			description: 'Who is the Dragon? Who is the healer? Who is the mind reader? Will the Dragon eat them all?',
			guildOnly: true
		});

		this.playing = new Set();
	}

	async run(msg) { // eslint-disable-line complexity
		if (this.playing.has(msg.channel.id)) return msg.say('Only one game may be occurring per channel.');
		this.playing.add(msg.channel.id);
		try {
			await msg.say('You will need at least 2 more players. To join, type `join game`.');
			const joined = [];
			joined.push(msg.author.id);
			const filter = res => {
				if (joined.includes(res.author.id)) return false;
				if (res.content.toLowerCase() !== 'join game') return false;
				joined.push(res.author.id);
				return true;
			};
			const verify = await msg.channel.awaitMessages(filter, { time: 30000 });
			if (verify.size < 2) {
				this.playing.delete(msg.channel.id);
				return msg.say('Failed to start the game...');
			}
			let roles = ['dragon', 'healer', 'mind reader'];
			for (let i = 0; i < (verify.size - 2); i++) roles.push(`pleb ${i + 1}`);
			roles = shuffle(roles);
			verify.set(msg.id, msg);
			const players = new Collection();
			let i = 1;
			for (const message of verify.values()) {
				players.set(i, {
					id: i,
					user: message.author,
					role: roles[i - 1]
				});
				await message.author.send(`Your role will be: ${roles[i]}!`);
				i++;
			}
			let turn = 1;
			while (players.size > 2) {
				let eaten = null;
				let healed = null;
				await msg.say(`Night ${turn}, sending DMs...`);
				for (const player of players.values()) {
					if (player.role.includes('pleb')) continue;
					const valid = players.filter(p => p.role !== player.role);
					await player.user.send(stripIndents`
						${questions[player.role]} Please type the number.
						${valid.map(p => `**${p.id}.** ${p.user.tag}`).join('\n')}
					`);
					const filter2 = res => valid.map(p => p.id.toString()).includes(res.content);
					const decision = await player.user.dmChannel.awaitMessages(filter2, {
						max: 1,
						time: 30000
					});
					if (!decision.size) {
						await player.user.send('Sorry, time is up!');
						continue;
					}
					const choice = parseInt(decision.first().content, 10);
					if (player.role === 'dragon') {
						eaten = players.get(choice).id;
						await player.user.send(`${choice} will be eaten...`);
					} else if (player.role === 'healer') {
						healed = players.get(choice).id;
						await player.user.send(`${choice} will be healed...`);
					} else if (player.role === 'mind reader') {
						await player.user.send(players.find('role', 'dragon').id === choice ? 'Yes.' : 'No.');
					}
				}
				const display = eaten ? players.get(eaten).user : null;
				const story = stories[Math.floor(Math.random() * story.length)];
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
				await wait(60000);
				await msg.say(stripIndents`
					Who do you think is the dragon? Please type the number.
					${players.map(p => `**${p.id}.** ${p.user.tag}`).join('\n')}
				`);
				const voted = [];
				const filter2 = res => {
					if (!players.exists(p => p.user.id === res.author.id)) return false;
					if (voted.includes(res.author.id)) return false;
					if (!players.has(parseInt(res.content, 10))) return false;
					voted.push(res.author.id);
					return true;
				};
				const votes = await msg.channel.awaitMessages(filter2, { time: 30000 });
				const counts = new Collection();
				for (const vote of votes.values()) {
					const player = players.get(parseInt(vote.content, 10));
					counts.set(player.id, {
						id: player.id,
						votes: counts.has(player.id) ? ++counts.get(player.id).votes : 1,
						user: player.user
					});
				}
				if (!counts.size) {
					await msg.say('No one will be expelled.');
					continue;
				}
				const expelled = counts.sort((a, b) => b.votes - a.votes).first();
				await msg.say(`${expelled.user} will be expelled.`);
				players.delete(expelled.id);
				if (!players.exists('role', 'dragon')) break;
				++turn;
			}
			this.playing.delete(msg.channel.id);
			const dragon = players.find('role', 'dragon');
			if (!dragon) return msg.say('The dragon has been vanquished! Thanks for playing!');
			return msg.say(`Oh no, the dragon wasn't caught in time... Nice job, ${dragon.user}!`);
		} catch (err) {
			this.playing.delete(msg.channel.id);
			throw err;
		}
	}
};
