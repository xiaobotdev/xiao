const Command = require('../../framework/Command');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { stripIndents } = require('common-tags');
const { shuffle, removeDuplicates } = require('../../util/Util');
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
		const kills = {};
		for (const tribute of tributes) kills[tribute] = 0;
		const remaining = new Set(shuffle(tributes));
		while (remaining.size > 1) {
			if (!bloodbath && sun) ++turn;
			const sunEvents = bloodbath ? events.bloodbath : sun ? events.day : events.night;
			const results = [];
			const deaths = [];
			this.makeEvents(remaining, kills, sunEvents, deaths, results);
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
					time: 30000
				});
				if (buttonPress.customId === 'false') {
					await buttonPress.update({ content: text, components: [] });
					return msg.reply('Too bad...');
				}
			} catch {
				await buttonPress.update({ content: text, components: [] });
				return msg.reply('See you next time!');
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
			event = event.replaceAll(`(Player${i + 1})`, `**${tributes[i]}**`);
		}
		return event;
	}

	makeEvents(tributes, kills, eventsArr, deaths, results) {
		const turn = new Set(tributes);
		for (const tribute of tributes) {
			if (!turn.has(tribute)) continue;
			const valid = eventsArr.filter(event => event.tributes <= turn.size && event.deaths < turn.size);
			const event = valid[Math.floor(Math.random() * valid.length)];
			turn.delete(tribute);
			if (event.tributes === 1) {
				if (event.deaths.length === 1) {
					deaths.push(tribute);
					tributes.delete(tribute);
				}
				results.push(this.parseEvent(event.text, [tribute]));
			} else {
				const current = [tribute];
				if (event.killers.includes(1)) kills[tribute] += event.deaths.length;
				if (event.deaths.includes(1)) {
					deaths.push(tribute);
					tributes.delete(tribute);
				}
				for (let i = 2; i <= event.tributes; i++) {
					const turnArr = Array.from(turn);
					const tribu = turnArr[Math.floor(Math.random() * turnArr.length)];
					if (event.killers.includes(i)) kills[tribu] += event.deaths.length;
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
