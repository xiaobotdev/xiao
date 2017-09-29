const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { stripIndents } = require('common-tags');

module.exports = class FortuneCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fortune',
			aliases: ['fortune-cookie'],
			group: 'random-res',
			memberName: 'fortune',
			description: 'Responds with a random fortune.'
		});
	}

	async run(msg) {
		try {
			const { body } = await snekfetch
				.get('http://fortunecookieapi.herokuapp.com/v1/cookie')
				.query({ limit: 1 });
			const data = body[0];
			return msg.say(stripIndents`
				${data.fortune.message}
				${data.lotto.numbers.join(', ')}
				${data.lesson.chinese} (${data.lesson.pronunciation}): ${data.lesson.english}
			`);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
