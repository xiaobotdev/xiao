const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const red = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const black = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
const numbers = [0].concat(red, black);
const dozens = ['1-12', '13-24', '25-36'];
const halves = ['1-18', '19-36'];
const columns = ['1st', '2nd', '3rd'];
const parity = ['even', 'odd'];
const colors = ['red', 'black'];

module.exports = class RouletteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'roulette',
			group: 'games',
			memberName: 'roulette',
			description: 'Play a game of roulette.',
			args: [
				{
					key: 'space',
					prompt: 'What space do you want to bet on?',
					type: 'string',
					validate: space => {
						if (numbers.includes(Number.parseInt(space, 10))) return true;
						if (dozens.includes(space)) return true;
						if (halves.includes(space)) return true;
						if (columns.includes(space.toLowerCase())) return true;
						if (parity.includes(space.toLowerCase())) return true;
						if (colors.includes(space.toLowerCase())) return true;
						return oneLine`
							Invalid space, please enter either a specific number from 0-36, a range of dozens (e.g. 1-12), a range of
							halves (e.g. 1-18), a column (e.g. 1st), a color (e.g. black), or a parity (e.g. even).
						`;
					},
					parse: space => space.toLowerCase()
				}
			]
		});
	}

	run(msg, { space }) {
		const number = Math.floor(Math.random() * 37);
		const color = !number ? null : red.includes(number) ? 'RED' : 'BLACK';
		const win = this.verifyWin(space, number);
		return msg.reply(`The result is **${number}${color ? ` ${color}` : ''}**. ${win ? 'You win!' : 'You lose...'}`);
	}

	verifyWin(choice, result) {
		if (dozens.includes(choice) || halves.includes(choice)) {
			const range = choice.split('-');
			return result >= range[0] && range[1] >= result;
		}
		if (colors.includes(choice)) {
			if (choice === 'black') return black.includes(result);
			if (choice === 'red') return red.includes(result);
		}
		if (parity.includes(choice)) return parity[result % 2] === choice;
		if (columns.includes(choice)) return columns[(result - 1) % 3] === choice;
		const number = Number.parseInt(choice, 10);
		if (numbers.includes(number)) return result === number;
		if (!result) return false;
		return false;
	}
};
