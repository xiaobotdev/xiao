const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const fortunes = require('../../assets/json/fortune');

module.exports = class FortuneCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fortune',
			aliases: ['fortune-cookie'],
			group: 'random',
			memberName: 'fortune',
			description: 'Responds with a random fortune.'
		});
	}

	run(msg) {
		return msg.say(stripIndents`
			${fortunes[Math.floor(Math.random() * fortunes.length)]}
			${Array.from({ length: 6 }, () => Math.floor(Math.random() * 100)).join(', ')}
		`);
	}
};
