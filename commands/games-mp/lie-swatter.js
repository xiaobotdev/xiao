const Command = require('../../framework/Command');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const { Collection } = require('@discordjs/collection');
const { delay, awaitPlayers } = require('../../util/Util');

module.exports = class LieSwatterCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lie-swatter',
			group: 'games-mp',
			memberName: 'lie-swatter',
			description: 'Players are given a fact and must quickly decide if it\'s True or a Lie.',
			game: true,
			credit: [
				{
					name: 'Jackbox Games',
					url: 'https://www.jackboxgames.com/',
					reason: 'Original "Lie Swatter" Game',
					reasonURL: 'https://www.jackboxgames.com/lie-swatter/'
				},
				{
					name: 'Open Trivia DB',
					url: 'https://opentdb.com/',
					reason: 'API',
					reasonURL: 'https://opentdb.com/api_config.php'
				}
			],
			args: [
				{
					key: 'players',
					type: 'integer',
					min: 1,
					max: 100
				}
			]
		});
	}

	async run(msg, { players }) {
		const awaitedPlayers = await awaitPlayers(msg, players, 1, this.client.blacklist.user);
		let turn = 0;
		const pts = new Collection();
		for (const player of awaitedPlayers) {
			pts.set(player, {
				points: 0,
				id: player,
				user: await this.client.users.fetch(player)
			});
		}
		const questions = await this.fetchQuestions();
		let lastTurnTimeout = false;
		const gameMsg = await msg.say('Loading...');
		while (questions.length) {
			++turn;
			const question = questions[0];
			questions.shift();
			const row = new ActionRowBuilder().addComponents(
				new ButtonBuilder().setCustomId('true').setStyle(ButtonStyle.Success).setLabel('The Truth'),
				new ButtonBuilder().setCustomId('false').setStyle(ButtonStyle.Danger).setLabel('A Lie')
			);
			const text = `**(${turn}) ${question.category}**\n${question.question}`;
			await gameMsg.edit({
				content: text,
				components: [row]
			});
			const answers = await this.getChoices(msg, pts.size, awaitedPlayers);
			if (!answers) {
				await gameMsg.edit({
					content: `No answers? Well, it was ${question.answer ? 'true' : 'a lie'}.`,
					components: []
				});
				if (questions.length) await delay(5000);
				if (lastTurnTimeout) {
					break;
				} else {
					lastTurnTimeout = true;
					continue;
				}
			}
			const correct = answers.filter(answer => answer.answer === question.answer);
			for (const answer of correct) {
				const player = pts.get(answer.id);
				if (correct[0].id === answer.id) player.points += 75;
				else player.points += 50;
			}
			await gameMsg.edit({
				content: stripIndents`
					It was... **${question.answer ? 'true' : 'a lie'}**!

					_Fastest Guess: ${correct.length ? `${pts.get(correct[0].id).user.tag} (+75 pts)` : 'No One...'}_
					${questions.length ? '_Next round starting in 5 seconds..._' : ''}
				`,
				components: []
			});
			if (lastTurnTimeout) lastTurnTimeout = false;
			if (questions.length) await delay(5000);
		}
		const winner = pts.sort((a, b) => b.points - a.points).first().user;
		return gameMsg.edit({
			content: stripIndents`
				Congrats, ${winner}!

				__**Top 10:**__
				${this.makeLeaderboard(pts).slice(0, 10).join('\n')}
			`,
			components: []
		});
	}

	getChoices(msg, max, players) {
		const collector = msg.channel.createMessageComponentCollector({
			filter: res => players.includes(res.user.id),
			componentType: ComponentType.Button,
			max,
			time: 30000
		});
		const answers = [];
		collector.on('collect', interaction => {
			let answer;
			if (interaction.customId === 'true') answer = true;
			if (interaction.customId === 'false') answer = false;
			interaction.deferUpdate();
			answers.push({ id: interaction.user.id, answer });
		});
		return new Promise(res => {
			collector.once('end', () => {
				if (answers.length === 0) res(null);
				return res(answers);
			});
		});
	}

	async fetchQuestions() {
		const { body } = await request
			.get('https://opentdb.com/api.php')
			.query({
				amount: 7,
				type: 'boolean',
				encode: 'url3986'
			});
		if (!body.results) return this.fetchQuestions();
		const questions = body.results;
		return questions.map(question => {
			const answer = question.correct_answer === 'True';
			return {
				question: decodeURIComponent(question.question),
				category: decodeURIComponent(question.category),
				answer
			};
		});
	}

	makeLeaderboard(pts) {
		let i = 0;
		let previousPts = null;
		let positionsMoved = 1;
		return pts
			.sort((a, b) => b.points - a.points)
			.map(player => {
				if (previousPts === player.points) {
					positionsMoved++;
				} else {
					i += positionsMoved;
					positionsMoved = 1;
				}
				previousPts = player.points;
				return `**${i}.** ${player.user.tag} (${player.points} Point${player.points === 1 ? '' : 's'})`;
			});
	}
};
