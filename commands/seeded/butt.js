const Command = require('../../structures/Command');
const { MersenneTwister19937, integer } = require('random-js');
const texts = require('../../assets/json/butt');

module.exports = class ButtCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'butt',
			aliases: ['butts', 'ass', 'booty'],
			group: 'seeded',
			memberName: 'butt',
			description: 'Determines a user\'s butt quality.',
			credit: [
				{
					name: 'iCrawl',
					url: 'https://github.com/iCrawl',
					reason: 'Code, Concept',
					reasonURL: 'https://github.com/iCrawl/Tohru/blob/master/src/commands/fun/butts.js'
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
		const random = MersenneTwister19937.seed(user.id);
		const quality = integer(0, texts.length - 1)(random);
		return msg.reply(`${user.id === msg.author.id ? 'ur' : `${user.username}'s`} butt is ${texts[quality]}`);
	}
};
