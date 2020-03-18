const Command = require('../../structures/Command');
const { delay, randomRange, verify } = require('../../util/Util');
const words = ['fire', 'draw', 'shoot', 'bang', 'pull', 'boom'];

module.exports = class GunfightCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'gunfight',
			aliases: ['western-gunfight'],
			group: 'games-mp',
			memberName: 'gunfight',
			description: 'Engage in a western gunfight against another user. High noon.',
			guildOnly: true,
			args: [
				{
					key: 'opponent',
					prompt: 'What user would you like to gunfight?',
					type: 'user'
				}
			]
		});
	}

	async run(msg, { opponent }) {
		if (opponent.bot) return msg.reply('Bots may not be fought.');
		if (opponent.id === msg.author.id) return msg.reply('You may not fight yourself.');
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
			await msg.say('Get Ready...');
			await delay(randomRange(1000, 30000));
			const word = words[Math.floor(Math.random() * words.length)];
			await msg.say(`TYPE \`${word.toUpperCase()}\` NOW!`);
			const filter = res => [opponent.id, msg.author.id].includes(res.author.id) && res.content.toLowerCase() === word;
			const winner = await msg.channel.awaitMessages(filter, {
				max: 1,
				time: 30000
			});
			this.client.games.delete(msg.channel.id);
			if (!winner.size) return msg.say('Oh... No one won.');
			return msg.say(`The winner is ${winner.first().author}!`);
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}
};
