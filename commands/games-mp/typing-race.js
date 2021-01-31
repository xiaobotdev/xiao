const Command = require('../../structures/Command');
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
			args: [
				{
					key: 'opponent',
					prompt: 'What user would you like to race against?',
					type: 'user'
				}
			]
		});
	}

	async run(msg, { opponent }) {
		if (opponent.bot) return msg.reply('Bots may not be played against.');
		if (opponent.id === msg.author.id) return msg.reply('You may not play against yourself.');
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
		try {
			await msg.say(`${opponent}, do you accept this challenge?`);
			const verification = await verify(msg.channel, opponent);
			if (!verification) {
				this.client.games.delete(msg.channel.id);
				return msg.say('Looks like they declined...');
			}
			const sentence = this.client.registry.commands.get('typing-test').generateSentence(6);
			const img = await this.client.registry.commands.get('typing-test').generateImage(sentence);
			await msg.say(`**Type the following sentence within 30 seconds:**`, {
				files: [{ attachment: img, name: 'typing-race.png' }]
			});
			const now = Date.now();
			const filter = res => [opponent.id, msg.author.id].includes(res.author.id) && res.content === sentence;
			const winner = await msg.channel.awaitMessages(filter, {
				max: 1,
				time: 30000
			});
			const newScore = Date.now() - now;
			const highScoreGet = await this.client.redis.get('typing-test');
			const highScore = highScoreGet ? Number.parseInt(highScoreGet, 10) : null;
			const highScoreUser = await this.client.redis.get('typing-test-user');
			const scoreBeat = !highScore || highScore > newScore;
			const user = await fetchHSUserDisplay(this.client, highScoreUser);
			if (scoreBeat) {
				await this.client.redis.set('typing-test', newScore);
				await this.client.redis.set('typing-test-user', winner.first().author.id);
			}
			this.client.games.delete(msg.channel.id);
			if (!winner.size) return msg.say('Oh... No one won.');
			return msg.say(stripIndents`
				The winner is ${winner.first().author}! (Took ${newScore / 1000} seconds)
				${scoreBeat ? `**New High Score!** Old:` : `High Score:`} ${highScore / 1000} (Held by ${user})
			`);
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}
};
