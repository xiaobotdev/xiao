const Command = require('../../framework/Command');
const { stripIndents } = require('common-tags');
const { verify, fetchHSUserDisplay } = require('../../util/Util');

module.exports = class TypingRaceCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'typing-race',
			group: 'games-mp',
			memberName: 'typing-race',
			description: 'Race a user to see who can type a sentence faster.',
			guildOnly: true,
			game: true,
			args: [
				{
					key: 'opponent',
					type: 'user'
				}
			]
		});
	}

	async run(msg, { opponent }) {
		if (opponent.bot) return msg.reply('Bots may not be played against.');
		if (opponent.id === msg.author.id) return msg.reply('You may not play against yourself.');
		if (this.client.blacklist.user.includes(opponent.id)) return msg.reply('This user is blacklisted.');
		await msg.say(`${opponent}, do you accept this challenge?`);
		const verification = await verify(msg.channel, opponent);
		if (!verification) return msg.say('Looks like they declined...');
		const sentence = this.client.registry.commands.get('typing-test').generateSentence(5);
		const img = await this.client.registry.commands.get('typing-test').generateImage(sentence);
		await msg.say(`**Type the following sentence within 30 seconds:**`, {
			files: [{ attachment: img, name: 'typing-race.png' }]
		});
		const now = Date.now();
		const filter = res => {
			if (![opponent.id, msg.author.id].includes(res.author.id)) return false;
			return res.content.toLowerCase() === sentence;
		};
		const winner = await msg.channel.awaitMessages({
			filter,
			max: 1,
			time: 30000
		});
		const newScore = Date.now() - now;
		const highScoreGet = await this.client.redis.get('typing-test');
		const highScore = highScoreGet ? Number.parseInt(highScoreGet, 10) : null;
		const highScoreUser = await this.client.redis.get('typing-test-user');
		const scoreBeat = winner.size && (!highScore || highScore > newScore);
		const user = await fetchHSUserDisplay(this.client, highScoreUser);
		if (scoreBeat) {
			await this.client.redis.set('typing-test', newScore);
			await this.client.redis.set('typing-test-user', winner.first().author.id);
		}
		if (!winner.size) return msg.say('Oh... No one won.');
		const wpm = (sentence.length / 5) / ((newScore / 1000) / 60);
		return msg.say(stripIndents`
			The winner is ${winner.first().author}! (Took ${newScore / 1000} seconds, ${Math.round(wpm)} WPM)
			${scoreBeat ? `**New High Score!** Old:` : `High Score:`} ${highScore / 1000}s (Held by ${user})
		`);
	}
};
