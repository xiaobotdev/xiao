const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class DoorsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'doors',
			aliases: ['door', 'door-opening', 'open-door'],
			group: 'games',
			memberName: 'doors',
			description: 'Open the right door, and you win the money! Make the wrong one, and you get the fire!',
			args: [
				{
					key: 'door',
					prompt: 'Which door number do you want to pick? A number from 1-3.',
					type: 'integer',
					min: 1,
					max: 3
				}
			]
		});
	}

	run(msg, { door }) {
		const win = Math.floor(Math.random() * 3) + 1;
		const emoji = door === win ? '💰' : '🔥';
		return msg.reply(stripIndents`
			${door === win ? 'You chose wisely.' : 'Hmm... Try again.'}
			${door === 1 ? emoji : '🚪'} ${door === 2 ? emoji : '🚪'} ${door === 3 ? emoji : '🚪'}
		`);
	}
};
