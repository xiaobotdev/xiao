const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { MessageEmbed } = require('discord.js');
const questions = require('../../assets/json/google-feud');

module.exports = class GoogleFeudCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'google-feud',
			group: 'games',
			memberName: 'google-feud',
			description: 'Attempt to determine the top suggestions for a Google search.'
		});

		this.playing = new Set();
	}

	async run(msg) {
		if (this.playing.has(msg.channel.id)) return msg.reply('Only one fight may be occurring per channel.');
		this.playing.add(msg.channel.id);
		const question = questions[Math.floor(Math.random() * questions.length)];
		try {
			const suggestions = await this.fetchSuggestions(question);
			const display = new Array(suggestions.length).fill('???');
			let tries = 3;
			while (display.includes('???') && tries) {
				const embed = new MessageEmbed()
					.setColor(0x005AF0)
					.setTitle(`${question}...?`)
					.setDescription('Type the choice you think is a suggestion _without_ the question.')
					.setFooter(`${tries} tries remaining!`);
				for (let i = 0; i < suggestions.length; i++) embed.addField(`❯ ${10000 - (i * 1000)}`, display[i], true);
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
					await msg.say('Nice job!');
					display[suggestions.indexOf(choice)] = choice;
				} else {
					--tries;
					await msg.say(`Nope! ${tries} tries remaining!`);
				}
			}
			this.playing.delete(msg.channel.id);
			if (!display.includes('???')) return msg.say('You win! Nice job, master of Google!');
			return msg.say('Better luck next time!');
		} catch (err) {
			this.playing.delete(msg.channel.id);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchSuggestions(question) {
		const { text } = await snekfetch
			.get('https://suggestqueries.google.com/complete/search')
			.query({
				client: 'firefox',
				q: question
			});
		const suggestions = JSON.parse(text)[1];
		if (!suggestions.length) return null;
		return suggestions
			.filter(suggestion => suggestion.toLowerCase() !== question.toLowerCase())
			.map(suggestion => suggestion.toLowerCase().replace(question.toLowerCase(), '').trim());
	}
};
