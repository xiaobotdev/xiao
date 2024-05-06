const Command = require('../../framework/Command');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Collection } = require('@discordjs/collection');
const { stripIndents } = require('common-tags');
const { removeDuplicates, removeFromArray, shuffle } = require('../../util/Util');
const events = require('../../assets/json/hunger-games');

module.exports = class HungerGamesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hunger-games',
			aliases: ['hunger-games-simulator', 'hunger-games-sim'],
			group: 'games-sp',
			memberName: 'hunger-games',
			description: 'Simulate a Hunger Games match with up to 24 tributes.',
			game: true,
			credit: [
				{
					name: 'BrantSteele',
					url: 'https://brantsteele.com/',
					reason: 'Original "Hunger Games Simulator" Game',
					reasonURL: 'http://brantsteele.net/hungergames/reaping.php'
				}
			],
			args: [
				{
					key: 'tributes',
					type: 'string',
					infinite: true,
					max: 20
				}
			]
		});
	}

	async run(msg, { tributes }) {
		if (tributes.length < 2) return msg.say(`...${tributes[0]} wins, as they were the only tribute.`);
		if (tributes.length > 24) return msg.reply('Please do not enter more than 24 tributes.');
		if (removeDuplicates(tributes).length !== tributes.length) {
			return msg.reply('Please do not enter the same tribute twice.');
		}
		let sun = true;
		let turn = 0;
		let bloodbath = true;
		const players = new Collection();
		for (const tribute of tributes) {
			players.set(tribute, {
				name: tribute,
				kills: 0,
				weapon: null,
				food: 0,
				sanity: 50,
				dead: false,
				injured: false
			});
		}
		while (players.filter(player => !player.dead).size > 1) {
			if (!bloodbath && sun) ++turn;
			const sunEvents = bloodbath ? events.bloodbath : sun ? events.day : events.night;
			const { results, deaths } = this.makeEvents(players, sunEvents);
			let text = stripIndents`
				__**${bloodbath ? 'Bloodbath' : sun ? `Day ${turn}` : `Night ${turn}`}:**__
				${results.join('\n')}
			`;
			if (deaths.length) {
				text += '\n\n';
				text += stripIndents`
					**${deaths.length} cannon shot${deaths.length === 1 ? '' : 's'} can be heard in the distance.**
					${deaths.join('\n')}
				`;
			}
			const proceedRows = new ActionRowBuilder().addComponents(
				new ButtonBuilder().setCustomId('true').setLabel('Yes').setStyle(ButtonStyle.Success),
				new ButtonBuilder().setCustomId('false').setLabel('No').setStyle(ButtonStyle.Danger)
			);
			const gameMsg = await msg.say(`${text}\n\n_Proceed?_`, { components: [proceedRows] });
			let buttonPress;
			try {
				buttonPress = await gameMsg.awaitMessageComponent({
					filter: res => res.user.id === msg.author.id,
					max: 1,
					time: 120000
				});
				if (buttonPress.customId === 'false') {
					await buttonPress.update({ content: text, components: [] });
					return msg.say('Too bad...');
				}
			} catch {
				await buttonPress.update({ content: text, components: [] });
				return msg.say('See you next time!');
			}
			await buttonPress.update({ content: text, components: [] });
			if (!bloodbath) sun = !sun;
			if (bloodbath) bloodbath = false;
		}
		return msg.say(stripIndents`
			And the winner is... **${players.filter(player => !player.dead).first().name}**!

			__**Kills Leaderboard:**__
			${this.makeLeaderboard(players).join('\n') || 'No one killed anyone...'}
		`);
	}

	parseEvent(event, tributes) {
		for (let i = 0; i < tributes.length; i++) {
			event = event.replaceAll(`(Player${i + 1})`, `**${tributes[i].name}**`);
		}
		return event;
	}

	makeEvents(tributes, eventsArr) {
		const results = [];
		const deaths = [];
		const remaining = tributes.filter(tribute => !tribute.dead);
		const remainingArr = shuffle([...remaining.keys()]);
		const turn = new Set(remainingArr);
		for (const tributeKey of remainingArr) {
			const tribute = tributes.get(tributeKey);
			if (!turn.has(tribute.name)) continue;
		 let types = this.decideTypes(tribute);
			if (turn.size === 1) types = removeFromArray(types, 'kill');
			const type = types[Math.floor(Math.random() * types.length)];
			const valid = eventsArr.filter(event => {
				if (event.type !== type) return false;
				if (event.type === 'kill' && tribute.weapon && !event.requires) {
					const useWeapon = Math.floor(Math.random() * 2);
					if (useWeapon) return false;
				}
				if (event.requires && event.requires !== 'food' && event.requires !== tribute.weapon) return false;
				if (event.requires && event.requires === 'food' && tribute.food <= 0) return false;
				if (event.requires && event.requires === '!food' && tribute.food !== 0) return false;
				if (event.spoils && !event.spoils.includes('food') && tribute.weapon) return false;
				return event.tributes <= turn.size && event.deaths.length < turn.size;
			});
			let event = valid[Math.floor(Math.random() * valid.length)];
			if (!event) {
				const fallback = eventsArr.filter(e => {
					if (e.type !== 'action') return false;
					if (e.deaths.length > 0) return false;
					if (e.requires && e.requires !== tribute.weapon) return false;
					if (e.spoils && tribute.weapon) return false;
					return e.tributes === 1;
				});
				event = fallback[Math.floor(Math.random() * fallback.length)];
			}
			turn.delete(tribute.name);
			if (event.tributes === 1) {
				if (event.requires === 'food') tribute.food--;
				if (event.spoils) {
					const spoils = event.spoils[0];
					if (spoils === 'food') tribute.food++;
					if (spoils === '-food') tribute.food--;
					else tribute.weapon = spoils;
				}
				if (event.deaths.length === 1) {
					deaths.push(tribute.name);
					tribute.dead = true;
				}
				if (event.injured.length === 1) tribute.injured = true;
				if (event.cures.length === 1) tribute.injured = false;
				tribute.sanity += event.sanity[0];
				results.push(this.parseEvent(event.text, [tribute]));
			} else {
				const current = [tribute];
				if (event.requires === 'food') tribute.food--;
				if (event.spoils) {
					const spoils = event.spoils[0];
					if (spoils === 'food') tribute.food++;
					if (spoils === '-food') tribute.food--;
					else tribute.weapon = spoils;
				}
				if (event.killers.includes(1)) tribute.kills += event.deaths.length;
				if (event.deaths.includes(1)) {
					deaths.push(tribute.name);
					tribute.dead = true;
				}
				if (event.injured.includes(1)) tribute.injured = true;
				if (event.cures.includes(1)) tribute.injured = false;
				tribute.sanity += event.sanity[0];
				for (let i = 2; i <= event.tributes; i++) {
					const turnArr = Array.from(turn);
					const tribu = tributes.get(turnArr[Math.floor(Math.random() * turnArr.length)]);
					if (event.requires === 'food') tribu.food--;
					if (event.spoils) {
						const spoils = event.spoils[i - 1];
						if (spoils === 'food') tribu.food++;
						if (spoils === '-food') tribu.food--;
						else tribu.weapon = spoils;
					}
					if (event.killers.includes(i)) tribu.kills += event.deaths.length;
					if (event.deaths.includes(i)) {
						deaths.push(tribu.name);
						tribu.dead = true;
					}
					if (event.injured.includes(i)) tribu.injured = true;
					if (event.cures.includes(i)) tribu.injured = false;
					tribu.sanity += event.sanity[i - 1];
					current.push(tribu);
					turn.delete(tribu.name);
				}
				results.push(this.parseEvent(event.text, current));
			}
		}
		return { results, deaths };
	}

	decideTypes(tribute) {
		const types = [];
		if (tribute.sanity > 80) {
			if (tribute.food > 0) {
				types.push('food', 'food', 'food', 'food');
			} else {
				types.push('action', 'action', 'action', 'action');
			}
			if (tribute.injured) {
				types.push('injury', 'injury', 'injury', 'action');
			} else {
				types.push('action', 'action', 'action', 'action');
			}
			if (!tribute.weapon) {
				types.push('weapon', 'weapon', 'weapon', 'weapon');
			}
			types.push('action');
			types.push('kill');
		} else if (tribute.sanity > 60) {
			if (tribute.food > 0) {
				types.push('food', 'food', 'food', 'food');
			} else {
				types.push('action', 'action', 'action');
				types.push('kill');
			}
			if (tribute.injured) {
				types.push('injury', 'injury', 'injury');
				types.push('suicide');
			} else {
				types.push('action', 'action', 'action');
				types.push('kill');
			}
			if (!tribute.weapon) {
				types.push('weapon', 'weapon', 'weapon', 'weapon');
			}
			types.push('kill');
			types.push('action');
		} else if (tribute.sanity > 40) {
			if (tribute.food > 0) {
				types.push('food', 'food', 'food');
				types.push('kill');
			} else {
				types.push('action', 'action');
				types.push('kill', 'kill');
			}
			if (tribute.injured) {
				types.push('injury', 'injury', 'injury');
				types.push('suicide');
			} else {
				types.push('action', 'action');
				types.push('kill', 'kill');
			}
			if (!tribute.weapon) {
				types.push('weapon', 'weapon', 'weapon', 'weapon');
			}
			types.push('kill', 'kill');
		} else if (tribute.sanity > 20) {
			if (tribute.food > 0) {
				types.push('food', 'food');
				types.push('kill', 'kill');
			} else {
				types.push('action');
				types.push('kill', 'kill', 'kill');
			}
			if (tribute.injured) {
				types.push('injury', 'injury', 'injury');
				types.push('suicide');
			} else {
				types.push('kill', 'kill', 'kill');
				types.push('action');
			}
			if (!tribute.weapon) {
				types.push('weapon', 'weapon', 'weapon', 'weapon');
			}
			types.push('kill', 'kill');
		} else if (tribute.sanity > 10) {
			if (tribute.food > 0) {
				types.push('food');
				types.push('kill', 'kill', 'kill');
			} else {
				types.push('kill', 'kill', 'kill', 'kill');
			}
			if (tribute.injured) {
				types.push('injury', 'injury', 'injury');
				types.push('suicide');
			} else {
				types.push('kill', 'kill', 'kill', 'kill');
			}
			if (!tribute.weapon) {
				types.push('weapon', 'weapon', 'weapon', 'weapon');
			}
			types.push('kill', 'kill');
		} else if (tribute.sanity <= 0) {
			types.push('suicide');
			types.push('kill', 'kill');
			if (!tribute.weapon) {
				types.push('weapon', 'weapon', 'weapon', 'weapon');
			}
		} else {
			types.push('action');
		}
		return types;
	}

	makeLeaderboard(tributes) {
		let i = 0;
		let previousPts = null;
		let positionsMoved = 1;
		return tributes
			.filter(tribute => tribute.kills > 0)
			.sort((a, b) => b.kills - a.kills)
			.map(tribute => {
				if (previousPts === tribute.kills) {
					positionsMoved++;
				} else {
					i += positionsMoved;
					positionsMoved = 1;
				}
				previousPts = tribute.kills;
				return `**${i}.** ${tribute.name} (${tribute.kills} Kill${tribute.kills === 1 ? '' : 's'})`;
			});
	}
};
