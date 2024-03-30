const Command = require('../../framework/Command');
const roasts = require('../../assets/json/roast');

module.exports = class RoastCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'roast',
			aliases: ['insult'],
			group: 'random-res',
			memberName: 'roast',
			description: 'Roasts a user.',
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
		return msg.say(`${user.username}, ${roasts[Math.floor(Math.random() * roasts.length)]}`);
	}
};
