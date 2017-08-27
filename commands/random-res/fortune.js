const Command = require('../../structures/Command');
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
			return msg.say(stripIndents`
				${body[0].fortune.message}
				${body[0].lotto.numbers.join(', ')}
				${body[0].lesson.chinese} (${body[0].lesson.pronunciation}): ${body[0].lesson.english}
			`);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
