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
		const random = new Random(Random.engines.mt19937().seed(user.id));
		const quality = random.integer(0, texts.length - 1);
		return msg.reply(`${user.id === msg.author.id ? 'ur' : `${user.username}'s`} butt is ${texts[quality]}`);
	}
};
