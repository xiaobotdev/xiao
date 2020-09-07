const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');

module.exports = class WouldYouRatherCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'would-you-rather',
			aliases: ['wy-rather', 'wyr'],
			group: 'random-res',
			memberName: 'would-you-rather',
			description: 'Responds with a random "Would you rather ...?" question.',
			credit: [
				{
					name: 'either',
					url: 'http://either.io',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		const data = await this.fetchScenario();
		return msg.say(stripIndents`
			${data.prefix ? `${data.prefix}, would you rather...` : 'Would you rather...'}
			**${data.option_1}** or **${data.option_2}**
		`);
	}

	async fetchScenario() {
		const { text } = await request.get('http://either.io/');
		return JSON.parse(text.match(/window.initial_question = (\{.+\})/)[1]).question;
	}
};
