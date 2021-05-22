const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const { formatNumber } = require('../../util/Util');
const choices = ['1', '2'];

module.exports = class WouldYouRatherCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'would-you-rather',
			aliases: ['wy-rather', 'wyr'],
			group: 'games-sp',
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
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
		try {
			const data = await this.fetchScenario();
			await msg.say(stripIndents`
				${data.prefix ? `${data.prefix}, would you rather...` : 'Would you rather...'}
				**1.** ${data.option_1}
				**2.** ${data.option_2}

				_Respond with either **1** or **2** to continue._
			`);
			const filter = res => res.author.id === msg.author.id && choices.includes(res.content.toLowerCase());
			const msgs = await msg.channel.awaitMessages(filter, {
				time: 30000,
				max: 1
			});
			if (!msgs.size) {
				this.client.games.delete(msg.channel.id);
				return msg.reply(stripIndents`
					No response? Too bad.
					${formatNumber(data.option1_total)} - ${formatNumber(data.option2_total)}
				`);
			}
			const option1 = msgs.first().content.toLowerCase() === '1';
			await this.postResponse(data.id, option1);
			const totalVotes = Number.parseInt(data.option1_total, 10) + Number.parseInt(data.option2_total, 10);
			const numToUse = option1 ? Number.parseInt(data.option1_total, 10) : Number.parseInt(data.option2_total, 10);
			this.client.games.delete(msg.channel.id);
			return msg.reply(stripIndents`
				**${Math.round((numToUse / totalVotes) * 100)}%** of people agree!
				${formatNumber(data.option1_total)} - ${formatNumber(data.option2_total)}
			`);
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchScenario() {
		const { text } = await request.get('http://either.io/questions/next/');
		return JSON.parse(text).questions[0];
	}

	async postResponse(id, bool) {
		try {
			const { text } = await request
				.get(`http://either.io/vote/${id}/${bool ? '1' : '2'}`)
				.set({ 'X-Requested-With': 'XMLHttpRequest' });
			return JSON.parse(text).result;
		} catch {
			return false;
		}
	}
};
