const Command = require('../../framework/Command');
const { MersenneTwister19937, integer } = require('random-js');

module.exports = class ThiccCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'thicc',
			aliases: ['thick'],
			group: 'random-seed',
			description: 'Determines how thicc you are.',
			args: [
				{
					key: 'user',
					type: 'user',
					default: msg => msg.author
				}
			],
			credit: [
				{
					name: '0vertime-dev',
					url: 'https://github.com/0vertime-dev',
					reason: 'Concept'
				}
			]
		});
	}

	run(msg, { user }) {
		if (this.client.isOwner(user)) {
			if (user.id === msg.author.id) return msg.reply(`You are thi${'c'.repeat(100)}`);
			return msg.reply(`She's thi. Not even one c.`);
		}
		const clientAuthor = user.id === this.client.user.id;
		const random = MersenneTwister19937.seed(clientAuthor ? msg.author.id : user.id);
		const length = integer(0, 100)(random);
		let pronoun = 'They';
		if (user.id === msg.author.id) pronoun = 'You';
		return msg.reply(`${pronoun} are thi${'c'.repeat(clientAuthor ? length + 1 : length)}`);
	}
};
