const Command = require('../../framework/Command');
const { stripIndents } = require('common-tags');
const { delay, randomRange, fetchHSUserDisplay } = require('../../util/Util');
const words = ['fire', 'draw', 'shoot', 'bang', 'pull', 'boom'];

module.exports = class ReactionTimeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reaction-time',
			aliases: ['reaction', 'react', 'gunfight-sp', 'sp-gunfight'],
			group: 'games-sp',
			description: 'Test your reaction time.',
			game: true
		});
	}

	async run(msg) {
		await msg.say('Get Ready...');
		await delay(randomRange(1000, 30000));
		const word = words[Math.floor(Math.random() * words.length)];
		await msg.say(`TYPE \`${word.toUpperCase()}\` NOW!`);
		const filter = res => msg.author.id === res.author.id && res.content.toLowerCase() === word;
		const now = Date.now();
		const msgs = await msg.channel.awaitMessages({
			filter,
			max: 1,
			time: 30000
		});
		const newScore = Date.now() - now;
		const highScoreGet = await this.client.redis.db.get('reaction-time');
		const highScore = highScoreGet ? Number.parseInt(highScoreGet, 10) : null;
		const highScoreUser = await this.client.redis.db.get('reaction-time-user');
		const scoreBeat = !highScore || highScore > newScore;
		const user = await fetchHSUserDisplay(this.client, highScoreUser);
		if (scoreBeat) {
			await this.client.redis.db.set('reaction-time', newScore);
			await this.client.redis.db.set('reaction-time-user', msg.author.id);
		}
		if (!msgs.size) return msg.say('Failed to answer within 30 seconds.');
		return msg.say(stripIndents`
			Nice one! (Took ${newScore / 1000} seconds)
			${scoreBeat ? `**New High Score!** Old:` : `High Score:`} ${highScore / 1000} (Held by ${user})
		`);
	}
};
