const Command = require('../../structures/Command');

module.exports = class CoolnessCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'coolness',
			group: 'random',
			memberName: 'coolness',
			description: 'Determines your coolness.'
		});
	}

	run(msg) {
		const coolness = msg.author.id / this.client.user.id;
		if (coolness < 0.3) return msg.reply('You are the coolest being to walk this Earth.');
		if (coolness < 0.5) return msg.reply('You are an extremely cool dude.');
		if (coolness < 0.8) return msg.reply('You\'re pretty sweet, not gonna lie.');
		if (coolness < 1) return msg.reply('You\'re okay, nothing special.');
		if (coolness < 1.3) return msg.say('You just aren\'t all that neat.');
		return msg.say('You suck, honestly.');
	}
};
