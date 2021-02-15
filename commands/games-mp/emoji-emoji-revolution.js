const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { verify } = require('../../util/Util');
const emojis = ['⬆', '↗', '➡', '↘', '⬇', '↙', '⬅', '↖'];
const emojisNew = ['⬆️', '↗️', '➡️', '↘️', '⬇️', '↙️', '⬅️', '↖️'];

module.exports = class EmojiEmojiRevolutionCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'emoji-emoji-revolution',
			aliases: ['eer'],
			group: 'games-mp',
			memberName: 'emoji-emoji-revolution',
			description: 'Can you type arrow emoji faster than anyone else has ever typed them before?',
			guildOnly: true,
			credit: [
				{
					name: 'Dance Dance Revolution',
					url: 'https://www.ddrgame.com/',
					reason: 'Concept'
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
			let turn = 0;
			let aPts = 0;
			let oPts = 0;
			let lastTurnTimeout = false;
			while (turn < 10) {
				++turn;
				const num = Math.floor(Math.random() * emojis.length);
				const emoji = [emojis[num], emojisNew[num]];
				await msg.say(emojisNew[num]);
				const filter = res => [msg.author.id, opponent.id].includes(res.author.id) && emoji.includes(res.content);
				const win = await msg.channel.awaitMessages(filter, {
					max: 1,
					time: 30000
				});
				if (!win.size) {
					await msg.say('Hmm... No one even tried that round.');
					if (lastTurnTimeout) {
						break;
					} else {
						lastTurnTimeout = true;
						continue;
					}
				}
				const winner = win.first().author;
				if (winner.id === msg.author.id) ++aPts;
				else ++oPts;
				await msg.say(stripIndents`
					${winner} won this round!
					**${msg.author.username}:** ${aPts}
					**${opponent.username}:** ${oPts}
				`);
				if (lastTurnTimeout) lastTurnTimeout = false;
			}
			this.client.games.delete(msg.channel.id);
			if (aPts === oPts) return msg.say('It\'s a tie!');
			const userWin = aPts > oPts;
			return msg.say(`You win ${userWin ? msg.author : opponent} with ${userWin ? aPts : oPts} points!`);
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}
};
