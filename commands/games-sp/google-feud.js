const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js');
const questions = require('../../assets/json/google-feud');

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
					reason: 'Original Game'
				}
			],
			args: [
				{
					key: 'question',
					prompt: 'What question do you want to use for the game?',
					type: 'string',
					default: () => questions[Math.floor(Math.random() * questions.length)]
				}
			]
		});
	}

	async run(msg, { question }) {
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
		try {
			const suggestions = await this.fetchSuggestions(question);
			if (!suggestions) return msg.say('Could not find any results.');
			const display = new Array(suggestions.length).fill('???');
			let tries = 3;
			while (display.includes('???') && tries) {
				const embed = new MessageEmbed()
					.setColor(0x005AF0)
					.setTitle(`${question}...?`)
					.setDescription('Type the choice you think is a suggestion _without_ the question.')
					.setFooter(`${tries} ${tries === 1 ? 'try' : 'tries'} remaining!`);
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
				if (suggestions.includes(choice)) display[suggestions.indexOf(choice)] = choice;
				else --tries;
			}
			this.client.games.delete(msg.channel.id);
			if (!display.includes('???')) return msg.say('You win! Nice job, master of Google!');
			return msg.say('Better luck next time!');
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
};
