const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { verify } = require('../../util/Util');
const doors = [1, 2, 3];

module.exports = class DoorsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'doors',
			aliases: ['door', 'door-opening', 'open-door', 'monty-hall'],
			group: 'games',
			memberName: 'doors',
			description: 'Open the right door, and you win the money! Make the wrong choice, and you get the fire!',
			args: [
				{
					key: 'door',
					prompt: 'Which door number do you want to pick? A number from 1-3.',
					type: 'integer',
					min: 1,
					max: 3
				}
			]
		});

		this.playing = new Set();
	}

	async run(msg, { door }) {
		if (this.playing.has(msg.channel.id)) return msg.reply('Only one game may be occurring per channel.');
		this.playing.add(msg.channel.id);
		try {
			const win = doors[Math.floor(Math.random() * doors.length)];
			const noWin = doors.filter(thisDoor => thisDoor !== win && door !== thisDoor)[0];
			await msg.reply(stripIndents`
				Well, there's nothing behind door number **${noWin}**. Do you want to stick with door ${door}?
				${this.emoji(1, noWin)} ${this.emoji(2, noWin)} ${this.emoji(3, noWin)}
			`);
			const stick = await verify(msg.channel, msg.author);
			if (!stick) door = doors.filter(thisDoor => door !== thisDoor && thisDoor !== noWin)[0];
			this.playing.delete(msg.channel.id);
			return msg.reply(stripIndents`
				${door === win ? 'You chose wisely.' : 'Hmm... Try again.'}
				${this.emoji(1, noWin, win, door)} ${this.emoji(2, noWin, win, door)} ${this.emoji(3, noWin, win, door)}
			`);
		} catch (err) {
			this.playing.delete(msg.channel.id);
			throw err;
		}
	}

	emoji(door, noWin, win, chosen) {
		return door === win && chosen === win ? '💰' : door === noWin ? '🔥' : door === chosen ? '🔥' : '🚪';
	}
};
