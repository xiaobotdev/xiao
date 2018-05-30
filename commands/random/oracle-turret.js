const Command = require('../../structures/Command');
const quotes = require('../../assets/json/oracle-turret');

module.exports = class OracleTurretCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'oracle-turret',
			aliases: ['im-different'],
			group: 'random',
			memberName: 'oracle-turret',
			description: 'Responds with a random Oracle Turret quote.'
		});
	}

	run(msg) {
		return msg.say(quotes[Math.floor(Math.random() * quotes.length)]);
	}
};
