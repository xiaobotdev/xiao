const Command = require('../../structures/Command');
const fortunes = require('../../assets/json/fortune');

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

	run(msg) {
		const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
		return msg.say(fortune);
	}
};
