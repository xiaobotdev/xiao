const Command = require('../../structures/Command');
const quotes = require('../../assets/json/oracle-turret');

module.exports = class OracleTurretCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'oracle-turret',
			group: 'random',
			memberName: 'oracle-turret',
			description: 'Responds with a random Oracle Turret quote.',
			credit: [
				{
					name: 'Portal 2',
					url: 'http://www.thinkwithportals.com/'
				}
			]
		});
	}

	run(msg) {
		return msg.say(quotes[Math.floor(Math.random() * quotes.length)]);
	}
};
