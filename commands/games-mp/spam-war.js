const Command = require('../../framework/Command');
const { delay, verify } = require('../../util/Util');

module.exports = class SpamWarCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'spam-war',
			aliases: ['spam-fight', 'spam-battle'],
			group: 'games-mp',
			description: 'See who can type more characters the fastest.',
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
		await msg.say('You get one point per character in your messages. You get 1 minute to spam.');
		await delay(5000);
		await msg.say('You have **1 minute** to spam. Go!');
		const msgs = await msg.channel.awaitMessages({
			filter: res => [opponent.id, msg.author.id].includes(res.author.id),
			time: 60000
		});
		const authorMsgs = msgs
			.filter(authorMsg => authorMsg.author.id === msg.author.id)
			.reduce((a, b) => a + b.content.length, 0);
		const opponentMsgs = msgs
			.filter(opponentMsg => opponentMsg.author.id === opponent.id)
			.reduce((a, b) => a + b.content.length, 0);
		const winner = authorMsgs > opponentMsgs ? msg.author : opponent;
		const winnerPts = authorMsgs > opponentMsgs ? authorMsgs : opponentMsgs;
		const loserPts = authorMsgs > opponentMsgs ? opponentMsgs : authorMsgs;
		if (authorMsgs === opponentMsgs) {
			return msg.say(`It was a tie! What are the odds? You both got **${winnerPts}** points!`);
		}
		return msg.say(`The winner is ${winner}, with **${winnerPts}** points! Your opponent only got ${loserPts}...`);
	}
};
