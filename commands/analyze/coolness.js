const { Command } = require('discord.js-commando');

module.exports = class CoolnessCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'coolness',
			group: 'analyze',
			memberName: 'coolness',
			description: 'Determines a user\'s coolness.',
			args: [
				{
					key: 'user',
					prompt: 'Which user do you want to determine the coolness of?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	run(msg, { user }) {
		const coolness = user.id / this.client.user.id;
		if (coolness < 0.2) return msg.say(`${user.username} is the coolest being to walk this Earth.`);
		if (coolness < 0.4) return msg.say(`${user.username} is extremely amazingly amazing.`);
		if (coolness < 0.6) return msg.say(`${user.username} is as cool as ice.`);
		if (coolness < 0.8) return msg.say(`${user.username} is an extremely cool dude.`);
		if (coolness < 1) return msg.say(`${user.username} is pretty sweet, not gonna lie.`);
		if (coolness < 1.2) return msg.say(`${user.username} is okay, nothing special.`);
		if (coolness < 1.4) return msg.say(`${user.username} is just not all that neat.`);
		if (coolness < 1.6) return msg.say(`${user.username} is awful, honestly.`);
		if (coolness < 1.8) return msg.say(`${user.username} smells like a sack of diapers.`);
		return msg.say(`${user.username} is terrible in every way.`);
	}
};
