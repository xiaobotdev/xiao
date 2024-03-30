const Command = require('../../framework/Command');
const { MersenneTwister19937, integer } = require('random-js');
const texts = require('../../assets/json/butt');

module.exports = class ButtCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'butt',
			aliases: ['butts', 'ass', 'booty'],
			group: 'random-seed',
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
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	run(msg, { user }) {
		const authorUser = user.id === msg.author.id;
		if (user.id === this.client.user.id) return msg.reply('Me? I think I have the best butt around!');
		if (this.client.isOwner(user)) {
			if (authorUser) return msg.reply('ur butt is godly, master');
			return msg.reply(`${user.username}'s butt is... Something, I'll say that much.`);
		}
		const random = MersenneTwister19937.seed(user.id);
		const quality = integer(0, texts.length - 1)(random);
		return msg.reply(`${authorUser ? 'ur' : `${user.username}'s`} butt is ${texts[quality]}`);
	}
};
