const Command = require('../../structures/Command');
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
			this.client.games.delete(msg.channel.id);
			if (!msgs.size) return msg.say(`Failed to answer within 30 seconds.`);
			return msg.say(`Nice one! (Took ${(Date.now() - now) / 1000} seconds)`);
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}
};
