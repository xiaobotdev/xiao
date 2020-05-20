const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { delay } = require('../../util/Util');
const directions = ['up', 'down', 'left', 'right'];

module.exports = class MemoryCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'memory',
			group: 'games-sp',
			memberName: 'memory',
			description: 'Test your memory.',
			args: [
				{
					key: 'level',
					prompt: 'How many directions do you want to have to memorize?',
					type: 'integer',
					min: 1,
					max: 20
				}
			]
		});
	}

	async run(msg, { level }) {
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
		try {
			const memorize = this.genArray(level);
			const memorizeDisplay = memorize.map(direction => `\`${direction.toUpperCase()}\``).join(' ');
			const memorizeMsg = await msg.say(stripIndents`
				**You have 10 seconds to memorize:**
				${memorizeDisplay}
			`);
			await delay(10000);
			if (memorizeMsg.deletable) await memorizeMsg.delete();
			await msg.say('Type what you saw. Don\'t worry about formatting, just the words.');
			const memorizeType = memorize.join(' ');
			const msgs = await msg.channel.awaitMessages(res => msg.author.id === res.author.id, {
				max: 1,
				time: 30000
			});
			this.client.games.delete(msg.channel.id);
			if (!msgs.size) return msg.say(`Sorry, time is up! It was ${memorizeDisplay}.`);
			const answer = msgs.first().content.toLowerCase();
			if (answer !== memorizeType) return msg.say(`Sorry, you typed it wrong. It was ${memorizeDisplay}.`);
			return msg.say('Nice job! 10/10! You deserve some cake!');
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}

	genArray(level) {
		const arr = [];
		for (let i = 0; i < level; i++) arr.push(directions[Math.floor(Math.random() * directions.length)]);
		return arr;
	}
};
