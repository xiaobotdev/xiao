const Command = require('../../framework/Command');
const quotes = require('../../assets/json/oracle-turret');

module.exports = class OracleTurretCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'oracle-turret',
			group: 'random-res',
			description: 'Responds with a random Oracle Turret quote.',
			credit: [
				{
					name: 'Valve',
					url: 'https://www.valvesoftware.com/en/',
					reasonURL: 'http://www.thinkwithportals.com/',
					reason: 'Original "Portal 2" Game'
				}
			]
		});
	}

	run(msg) {
		return msg.say(quotes[Math.floor(Math.random() * quotes.length)]);
	}
};
