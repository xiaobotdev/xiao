const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { verify } = require('../../util/Util');
const sentences = require('../../assets/json/typing-test');

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
			const sentence = sentences[Math.floor(Math.random() * sentences.length)];
			await msg.say(stripIndents`
				**Type the following sentence within 30 seconds:**
				${sentence}
			`);
			const now = Date.now();
			const filter = res => [opponent.id, msg.author.id].includes(res.author.id) && res.content === sentence;
			const winner = await msg.channel.awaitMessages(filter, {
				max: 1,
				time: 30000
			});
			this.client.games.delete(msg.channel.id);
			if (!winner.size) return msg.say('Oh... No one won.');
			return msg.say(`The winner is ${winner.first().author}! (Took ${(Date.now() - now) / 1000} seconds)`);
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}
};
