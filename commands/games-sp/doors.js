const Command = require('../../framework/Command');
const { stripIndents } = require('common-tags');
const { verify } = require('../../util/Util');
const doors = [1, 2, 3];

module.exports = class DoorsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'doors',
			aliases: ['door', 'door-opening', 'open-door', 'monty-hall'],
			group: 'games-sp',
			memberName: 'doors',
			description: 'Open the right door, and you win the money! Make the wrong choice, and you get the fire!',
			credit: [
				{
					name: 'Mythbusters',
					url: 'https://go.discovery.com/tv-shows/mythbusters',
					reason: 'Concept'
				},
				{
					name: 'Monty Hall problem',
					url: 'https://en.wikipedia.org/wiki/Monty_Hall_problem',
					reason: 'Concept'
				}
			],
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
	}

	async run(msg, { door }) {
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
		try {
			const win = doors[Math.floor(Math.random() * doors.length)];
			const noWin = doors.filter(thisDoor => thisDoor !== win && door !== thisDoor)[0];
			await msg.reply(stripIndents`
				Well, there's nothing behind door number **${noWin}**. Do you want to stick with door ${door}?
				${this.emoji(1, noWin)} ${this.emoji(2, noWin)} ${this.emoji(3, noWin)}
			`);
			const stick = await verify(msg.channel, msg.author);
			if (!stick) door = doors.filter(thisDoor => door !== thisDoor && thisDoor !== noWin)[0];
			this.client.games.delete(msg.channel.id);
			return msg.reply(stripIndents`
				${door === win ? 'You chose wisely.' : 'Hmm... Try again.'}
				${this.emoji(1, noWin, win, door)} ${this.emoji(2, noWin, win, door)} ${this.emoji(3, noWin, win, door)}
			`);
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	}

	emoji(door, noWin, win, chosen) {
		return door === win && chosen === win ? '💰' : door === noWin ? '🔥' : door === chosen ? '🔥' : '🚪';
	}
};
