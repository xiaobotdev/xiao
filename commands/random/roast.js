const { Command } = require('discord.js-commando');
const roasts = require('../../assets/json/roast');

module.exports = class RoastCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'roast',
			group: 'random',
			memberName: 'roast',
			description: 'Roasts a user.',
			args: [
				{
					key: 'user',
					prompt: 'What user do you want to roast?',
					type: 'user',
					default: ''
				}
			]
		});
	}

	run(msg, { user }) {
		if (!user) user = msg.author;
		return msg.say(`${user.username}, ${roasts[Math.floor(Math.random() * roasts.length)]}`);
	}
};
