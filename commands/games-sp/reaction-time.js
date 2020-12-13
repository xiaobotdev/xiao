const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { delay, randomRange } = require('../../util/Util');
const words = ['fire', 'draw', 'shoot', 'bang', 'pull', 'boom'];

module.exports = class ReactionTimeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reaction-time',
			aliases: ['reaction', 'react', 'gunfight-sp', 'sp-gunfight'],
			group: 'games-sp',
			memberName: 'reaction-time',
			description: 'Test your reaction time.'
		});
	}

	async run(msg) {
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
		try {
			await msg.say('Get Ready...');
			await delay(randomRange(1000, 30000));
			const word = words[Math.floor(Math.random() * words.length)];
			await msg.say(`TYPE \`${word.toUpperCase()}\` NOW!`);
			const filter = res => msg.author.id === res.author.id && res.content.toLowerCase() === word;
			const now = Date.now();
			const msgs = await msg.channel.awaitMessages(filter, {
				max: 1,
				time: 30000
			});
			const newScore = Date.now() - now;
			const highScoreGet = await this.client.redis.get('reaction-time');
			const highScore = highScoreGet ? Number.parseInt(highScoreGet, 10) : null;
			if (!highScore || highScore > newScore) await this.client.redis.set('reaction-time', newScore);
			this.client.games.delete(msg.channel.id);
			if (!msgs.size) return msg.say('Failed to answer within 30 seconds.');
			return msg.say(stripIndents`
				Nice one! (Took ${newScore / 1000} seconds)
				${!highScore || highScore > newScore ? `**New High Score!** Old:` : `High Score:`} ${highScore / 1000}
			`);
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}
};
