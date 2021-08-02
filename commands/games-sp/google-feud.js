const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js');
const { formatNumber, list } = require('../../util/Util');
const categories = ['qotd', 'culture', 'people', 'names', 'questions'];

module.exports = class GoogleFeudCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'google-feud',
			group: 'games-sp',
			memberName: 'google-feud',
			description: 'Attempt to determine the top suggestions for a Google search.',
			credit: [
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Autofill API'
				},
				{
					name: 'Google Feud',
					url: 'http://www.googlefeud.com/',
					reason: 'Question Data, Original Game'
				}
			],
			args: [
				{
					key: 'category',
					prompt: `What category do you want to use for the game? Either ${list(categories, 'or')}.`,
					type: 'string',
					oneOf: categories,
					parse: category => category.toLowerCase()
				}
			]
		});

		this.questions = null;
	}

	async run(msg, { category }) {
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
		try {
			if (!this.questions) await this.fetchQuestions();
			const question = this.questions[category][Math.floor(Math.random() * this.questions[category].length)];
			const suggestions = await this.fetchSuggestions(question);
			if (!suggestions) return msg.say('Could not find any results.');
			const display = new Array(suggestions.length).fill('???');
			let tries = 4;
			let score = 0;
			while (display.includes('???') && tries) {
				const embed = this.makeEmbed(question, tries, suggestions, display);
				await msg.embed(embed);
				const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
					max: 1,
					time: 30000
				});
				if (!msgs.size) {
					await msg.say('Time is up!');
					break;
				}
				const choice = msgs.first().content.toLowerCase();
				if (suggestions.includes(choice)) {
					score += 10000 - (suggestions.indexOf(choice) * 1000);
					display[suggestions.indexOf(choice)] = choice;
				} else {
					--tries;
				}
			}
			this.client.games.delete(msg.channel.id);
			if (!display.includes('???')) {
				return msg.say(`You win! Nice job, master of Google!\n**Final Score: $${formatNumber(score)}**`);
			}
			const final = this.makeEmbed(question, tries, suggestions, suggestions);
			return msg.say(`Better luck next time!\n**Final Score: $${formatNumber(score)}**`, { embeds: [final] });
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchSuggestions(question) {
		const { text } = await request
			.get('https://suggestqueries.google.com/complete/search')
			.query({
				client: 'firefox',
				q: question
			});
		const suggestions = JSON.parse(text)[1]
			.filter(suggestion => suggestion.toLowerCase() !== question.toLowerCase());
		if (!suggestions.length) return null;
		return suggestions.map(suggestion => suggestion.toLowerCase().replace(question.toLowerCase(), '').trim());
	}

	async fetchQuestions() {
		if (this.questions) return this.questions;
		const { body } = await request.get('https://www.googlefeud.com/autocomplete/js/questions-en.json');
		const questions = {};
		for (const category of categories) questions[category] = body[category];
		this.questions = questions;
		return this.questions;
	}

	makeEmbed(question, tries, suggestions, display) {
		const embed = new MessageEmbed()
			.setColor(0x005AF0)
			.setTitle(`${question}...?`)
			.setDescription('Type the choice you think is a suggestion _without_ the question.')
			.setFooter(`${tries} ${tries === 1 ? 'try' : 'tries'} remaining!`);
		for (let i = 0; i < suggestions.length; i++) {
			const num = formatNumber(10000 - (i * 1000));
			embed.addField(`❯ ${num}`, display[i], true);
		}
		return embed;
	}
};
