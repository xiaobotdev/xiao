const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const snekfetch = require('snekfetch');
const { shuffle } = require('../../structures/Util');
const { QUIZLET_KEY } = process.env;

module.exports = class QuizletGameCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'quizlet-game',
			aliases: ['quizlet-quiz', 'quizlet-test'],
			group: 'games',
			memberName: 'quizlet-game',
			description: 'Shuffle a Quizlet study deck and play a game similar to a quiz.',
			args: [
				{
					key: 'id',
					prompt: 'What is the ID of the deck you wish to use?',
					type: 'string',
					parse: id => encodeURIComponent(id)
				}
			]
		});

		this.playing = new Set();
	}

	async run(msg, { id }) {
		if (this.playing.has(msg.channel.id)) return msg.say('Only one fight may be occurring per channel.');
		this.playing.add(msg.channel.id);
		try {
			const { body } = await snekfetch
				.get(`https://api.quizlet.com/2.0/sets/${id}/terms`)
				.query({ client_id: QUIZLET_KEY });
			const terms = shuffle(body);
			const seen = new Set();
			while (terms.length > 0) {
				const term = terms[0];
				await msg.say(stripIndents`
					**You have 30 seconds to answer which word this is. (type "end game" to end the game)**
					${term.definition}${term.image ? `\n${term.image.url}` : ''}
				`);
				const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
					max: 1,
					time: 30000
				});
				if (!msgs.size) break;
				const choice = msgs.first().content.toLowerCase();
				if (choice === 'end game') break;
				if (choice !== term.term.toLowerCase()) {
					await msg.say(`Nope, sorry, it was ${term.term}.`);
					if (seen.has(term.term)) seen.delete(term.term);
					terms.push(term);
				} else {
					await msg.say('Nice job! 10/10! You deserve some cake!');
					if (seen.has(term.term)) seen.delete(term.term);
					else terms.push(term);
				}
				if (!seen.has(term.term)) seen.add(term.term);
				terms.shift();
			}
			this.playing.delete(msg.channel.id);
			return msg.say('See you next time!');
		} catch (err) {
			this.playing.delete(msg.channel.id);
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
