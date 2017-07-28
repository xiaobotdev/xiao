const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class EvolveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'evolve',
			group: 'roleplay',
			memberName: 'evolve',
			description: 'Evolves a user.',
			args: [
				{
					key: 'user',
					prompt: 'What user do you want to roleplay with?',
					type: 'user'
				}
			]
		});
	}

	run(msg, args) {
		const { user } = args;
		return msg.say(stripIndents`
			**${user.username}** *is evolving!*
			https://i.imgur.com/7bh8hoX.gif
		`);
	}
};
