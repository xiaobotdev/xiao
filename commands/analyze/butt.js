const Command = require('../../structures/Command');
const Random = require('random-js');
const texts = require('../../assets/json/butt');

module.exports = class ButtCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'butt',
			aliases: ['butts', 'ass', 'booty'],
			group: 'analyze',
			memberName: 'butt',
			description: 'Determines a user\'s butt quality.',
			credit: [
				{
					name: 'iCrawl/Tohru',
					url: 'https://github.com/iCrawl/Tohru/blob/master/src/commands/fun/butts.js'
				}
			],
			args: [
				{
					key: 'user',
					prompt: 'Which user do you want to determine the butt quality of?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	run(msg, { user }) {
		if (user.id === this.client.user.id) return msg.reply('Me? I think I have the best butt around!');
		const random = new Random(Random.engines.mt19937().seed(user.id));
		const quality = random.integer(0, texts.length - 1);
		return msg.reply(`${user.id === msg.author.id ? 'ur' : `${user.username}'s`} butt is ${texts[quality]}`);
	}
};
