const Command = require('../../framework/Command');
const { stripIndents } = require('common-tags');
const { verify } = require('../../util/Util');
const startWords = require('../../assets/json/word-list');

module.exports = class WordSpudCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'word-spud',
			group: 'games-mp',
			memberName: 'word-spud',
			description: 'Hot potato, but with words.',
			guildOnly: true,
			credit: [
				{
					name: 'Jackbox Games',
					url: 'https://www.jackboxgames.com/',
					reason: 'Original "Word Spud" Game',
					reasonURL: 'https://www.jackboxgames.com/word-spud/'
				}
			],
			args: [
				{
					key: 'opponent',
					prompt: 'What user would you like to play against?',
					type: 'user'
				}
			]
		});
	}

	async run(msg, { opponent }) {
		if (opponent.bot) return msg.reply('Bots may not be played against.');
		if (opponent.id === msg.author.id) return msg.reply('You may not play against yourself.');
		if (this.client.blacklist.user.includes(opponent.id)) return msg.reply('This user is blacklisted.');
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
			let currentWord = startWords[Math.floor(Math.random() * startWords.length)];
			let lastTurnTimeout = false;
			let gameEnd = false;
			let userTurn = false;
			while (!gameEnd) {
				const player = userTurn ? msg.author : opponent;
				await msg.say(stripIndents`
					${player}, continue the chain: **${currentWord} ...?**
					_Type \`end\` to end the game._
				`);
				const filter = res => res.author.id === player.id && res.content.length <= 100;
				const msgs = await msg.channel.awaitMessages({
					filter,
					max: 1,
					time: 30000
				});
				if (!msgs.size) {
					await msg.say('No ideas? No problem, moving on.');
					userTurn = !userTurn;
					if (lastTurnTimeout) {
						break;
					} else {
						lastTurnTimeout = true;
						continue;
					}
				}
				const word = msgs.first().content.toLowerCase();
				if (word === 'end') {
					gameEnd = true;
					break;
				}
				await msg.say(`${currentWord} **${word}**? Cool!`);
				currentWord = word;
				userTurn = !userTurn;
				if (lastTurnTimeout) lastTurnTimeout = false;
			}
			this.client.games.delete(msg.channel.id);
			return msg.say('Thanks for playing!');
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}
};
