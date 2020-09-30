const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const year = 2020;

module.exports = class UsElectionCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'us-election',
			aliases: ['election', 'usa-election', 'presidential-election', 'president-election', `${year}-election`],
			group: 'events',
			memberName: 'us-election',
			description: 'Responds with the odds of each canidate winning the presidential election, according to 538.',
			credit: [
				{
					name: 'FiveThirtyEight',
					url: 'https://fivethirtyeight.com/',
					reason: 'API',
					reasonURL: 'https://projects.fivethirtyeight.com/2020-election-forecast/'
				}
			]
		});
	}

	async run(msg) {
		const currentYear = new Date().getFullYear();
		if (year !== currentYear) {
			return msg.reply(`This command has not been updated to reflect the ${currentYear} election season.`);
		}
		try {
			const { winners, simulations } = await this.getList();
			const chances = Object.entries(winners)
				.map(([canidate, chances]) => `**${canidate}:** ${chances} in ${simulations}`);
			return msg.say(stripIndents`
				__**Chances of Winning the 2020 US Presidential Election (Accoring to FiveThirtyEight):**__
				${chances.join('\n')}

				_More detailed information is available at <https://projects.fivethirtyeight.com/2020-election-forecast/>._
			`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async getList() {
		const { body } = await request
			.get('https://projects.fivethirtyeight.com/2020-election-forecast/us_simulations.json');
		const winners = {};
		for (const simulation of body[0].simulations) {
			const existing = winners[simulation.winner];
			if (!existing) {
				winners[simulation.winner] = 1;
				continue;
			}
			winners[simulation.winner] += 1;
		}
		return { winners, simulations: body[0].simulations.length };
	}
};
