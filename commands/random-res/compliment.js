const Command = require('../../framework/Command');
const compliments = require('../../assets/json/compliment');

module.exports = class ComplimentCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'compliment',
			group: 'random-res',
			memberName: 'compliment',
			description: 'Compliments a user.',
			args: [
				{
					key: 'user',
					prompt: 'What user do you want to compliment?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	run(msg, { user }) {
		return msg.say(`${user.username}, ${compliments[Math.floor(Math.random() * compliments.length)]}`);
	}
};
