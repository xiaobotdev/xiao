const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { stripIndents } = require('common-tags');
const { WORDNIK_KEY } = process.env;

module.exports = class ReverseDictionaryCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reverse-dictionary',
			aliases: ['reverse-define', 'wordnik-reverse-define', 'wordnik-reverse-dictionary'],
			group: 'search',
			memberName: 'reverse-dictionary',
			description: 'Responds with the closest word for a given definition.',
			args: [
				{
					key: 'definition',
					prompt: 'What definition would you like to look up?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { definition }) {
		try {
			const { body } = await snekfetch
				.get('http://api.wordnik.com/v4/words.json/reverseDictionary')
				.query({
					query: definition,
					limit: 1,
					api_key: WORDNIK_KEY
				});
			if (!body.results) return msg.say('Could not find any results.');
			const data = body.results[0];
			return msg.say(stripIndents`
				**${data.word}**
				${data.text}
			`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
