const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const emojis = ['⬆', '↗', '➡', '↘', '⬇', '↙', '⬅', '↖'];

module.exports = class EmojiEmojiRevolutionCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'emoji-emoji-revolution',
			aliases: ['eer'],
			group: 'games',
			memberName: 'emoji-emoji-revolution',
			description: 'Play a game of Emoji Emoji Revolution.',
			guildOnly: true,
			args: [
				{
					key: 'opponent',
					prompt: 'Who would you like to play against?',
					type: 'user'
				}
			]
		});

		this.playing = new Set();
	}

	async run(msg, args) {
		const { opponent } = args;
		if (opponent.bot) return msg.say('Bots may not be played against.');
		if (opponent.id === msg.author.id) return msg.say('You may not play against yourself.');
		if (this.playing.has(msg.channel.id)) return msg.say('Only one fight may be occurring per channel.');
		this.playing.add(msg.channel.id);
		try {
			await msg.say(`${opponent}, do you accept this challenge?`);
			const verify = await msg.channel.awaitMessages(res => res.author.id === opponent.id, {
				max: 1,
				time: 30000
			});
			if (!verify.size || !['yes', 'y'].includes(verify.first().content.toLowerCase())) {
				this.playing.delete(msg.channel.id);
				return msg.say('Looks like they declined...');
			}
			let turn = 0;
			let aPts = 0;
			let oPts = 0;
			while (turn < 10) {
				++turn;
				const emoji = emojis[Math.floor(Math.random() * emojis.length)];
				await msg.say(emoji);
				const filter = res => [msg.author.id, opponent.id].includes(res.author.id) && res.content === emoji;
				const win = await msg.channel.awaitMessages(filter, {
					max: 1,
					time: 30000
				});
				if (!win.size) {
					await msg.say('Hmm... No one even tried that round.');
					continue;
				}
				const winner = win.first().author;
				if (winner.id === msg.author.id) ++aPts;
				else ++oPts;
				await msg.say(stripIndents`
					${winner} won this round!
					**${msg.author.username}:** ${aPts}
					**${opponent.username}:** ${oPts}
				`);
			}
			this.playing.delete(msg.channel.id);
			if (aPts === oPts) return msg.say('It\'s a tie!');
			return msg.say(`You win ${aPts > oPts ? msg.author : opponent} with ${aPts > oPts ? aPts : oPts} points!`);
		} catch (err) {
			this.playing.delete(msg.channel.id);
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
