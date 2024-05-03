const Command = require('../../framework/Command');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Collection } = require('@discordjs/collection');
const { stripIndents } = require('common-tags');
const { removeDuplicates } = require('../../util/Util');
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
				food: 2
			});
		}
		while (players.size > 1) {
			if (!bloodbath && sun) ++turn;
			const sunEvents = bloodbath ? events.bloodbath : sun ? events.day : events.night;
			const results = [];
			const deaths = [];
			this.makeEvents(players, kills, sunEvents, deaths, results);
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
		const remainingArr = Array.from(remaining);
		return msg.say(stripIndents`
			And the winner is... **${remainingArr[0]}**!

			__**Kills Leaderboard:**__
			${this.makeLeaderboard(tributes, kills).join('\n') || 'No one killed anyone...'}
		`);
	}

	parseEvent(event, tributes) {
		for (let i = 0; i < 6; i++) {
			event = event.replaceAll(`(Player${i + 1})`, `**${tributes[i].name}**`);
		}
		return event;
	}

	makeEvents(tributes, kills, eventsArr, deaths, results) {
		const turn = new Set(tributes.keys());
		for (const tribute of tributes.values()) {
			if (!turn.has(tribute)) continue;
			const valid = eventsArr.filter(event => {
				if (event.requires !== 'food' && event.requires !== tribute.weapon) return false;
				if (event.requires === 'food' && tribute.food <= 0) return false;
				if (event.spoils && !event.spoils.includes('food') && tribute.weapon) return false;
				return event.tributes <= turn.size && event.deaths < turn.size;
			});
			const event = valid[Math.floor(Math.random() * valid.length)];
			turn.delete(tribute);
			if (event.tributes === 1) {
				if (event.requires === 'food') tribute.food--;
				if (event.spoils) {
					const spoils = event.spoils[0];
					if (spoils === 'food') tribute.food++;
					else tribute.weapon = spoils;
				}
				if (event.deaths.length === 1) {
					deaths.push(tribute);
					tributes.delete(tribute);
				}
				results.push(this.parseEvent(event.text, [tribute]));
			} else {
				const current = [tribute];
				if (event.requires === 'food') tribute.food--;
				if (event.spoils) {
					const spoils = event.spoils[0];
					if (spoils === 'food') tribute.food++;
					else tribute.weapon = spoils;
				}
				if (event.killers.includes(1)) tribute.kills += event.deaths.length;
				if (event.deaths.includes(1)) {
					deaths.push(tribute);
					tributes.delete(tribute);
				}
				for (let i = 2; i <= event.tributes; i++) {
					const turnArr = Array.from(turn);
					const tribu = tributes.get(turnArr[Math.floor(Math.random() * turnArr.length)]);
					if (event.requires === 'food') tribu.food--;
					if (event.spoils) {
						const spoils = event.spoils[i];
						if (spoils === 'food') tribu.food++;
						else tribu.weapon = spoils;
					}
					if (event.killers.includes(i)) tribu.kills += event.deaths.length;
					if (event.deaths.includes(i)) {
						deaths.push(tribu);
						tributes.delete(tribu);
					}
					current.push(tribu);
					turn.delete(tribu);
				}
				results.push(this.parseEvent(event.text, current));
			}
		}
	}

	makeLeaderboard(tributes, kills) {
		let i = 0;
		let previousPts = null;
		let positionsMoved = 1;
		return tributes
			.filter(tribute => kills[tribute] > 0)
			.sort((a, b) => kills[b] - kills[a])
			.map(tribute => {
				if (previousPts === kills[tribute]) {
					positionsMoved++;
				} else {
					i += positionsMoved;
					positionsMoved = 1;
				}
				previousPts = kills[tribute];
				return `**${i}.** ${tribute} (${kills[tribute]} Kill${kills[tribute] === 1 ? '' : 's'})`;
			});
	}
};
