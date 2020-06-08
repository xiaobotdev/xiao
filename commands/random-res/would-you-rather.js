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
					name: 'rrrather',
					url: 'https://www.rrrather.com/',
					reason: 'API',
					reasonURL: 'https://www.rrrather.com/botapi'
				}
			]
		});
	}

	async run(msg) {
		const data = await this.fetchScenario(msg.channel.nsfw || false);
		return msg.say(stripIndents`
			${data.title}
			**${data.choicea}** or **${data.choiceb}**
		`);
	}

	async fetchScenario(nsfw) {
		const { body } = await request.get('https://www.rrrather.com/botapi');
		if (body.nsfw && !nsfw) return this.fetchScenario(nsfw);
		return body;
	}
};
