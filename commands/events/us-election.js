const Command = require('../../framework/Command');
const request = require('node-superfetch');
const cheerio = require('cheerio');
const { stripIndents } = require('common-tags');
const year = 2024;

module.exports = class UsElectionCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'us-election',
			aliases: ['election', 'usa-election', 'presidential-election', 'president-election', `${year}-election`],
			group: 'events',
			memberName: 'us-election',
			description: 'Responds with the odds of each canidate winning the presidential election.',
			credit: [
				{
					name: 'Election Betting Odds',
					url: 'https://electionbettingodds.com/',
					reason: 'Betting Data'
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
			const canidates = await this.getList();
			const list = canidates.map(
				canidate => `**${canidate.name}:** ${canidate.score} (${canidate.percentChange} in last day)`
			);
			return msg.say(stripIndents`
				__**Chances of Winning the ${year} US Presidential Election (According to Betting Markets):**__
				${list.join('\n')}

				_More detailed information is available at <https://electionbettingodds.com/>._
			`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async getList() {
		const { text } = await request.get('https://electionbettingodds.com/');
		const $ = cheerio.load(text);
		const canidates = [];
		const tables = $('table').eq(18).children().first().children();
		for (let i = 1; i < tables.length; i++) {
			let name = tables.eq(1).children().first().text().trim().match(/(.+) details/);
			if (!name) name = 'Other';
			else name = name[1];
			const score = tables.eq(i).children().eq(1).children().first().text().trim();
			const percentChange = tables.eq(i).children().eq(1).children().eq(1).text().trim();
			canidates.push({ name, score, percentChange });
		}
		return canidates;
	}
};
