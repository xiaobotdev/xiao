const Command = require('../../framework/Command');
const compliments = require('../../assets/json/compliment');

module.exports = class ComplimentCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'compliment',
			group: 'random-res',
			description: 'Compliments a user.',
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
		const compliment = compliments[Math.floor(Math.random() * compliments.length)];
		return msg.say(`${user.globalName || user.username}, ${compliment}`);
	}
};
