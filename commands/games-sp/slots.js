const Command = require('../../framework/Command');
const { stripIndents } = require('common-tags');
const slots = ['🍇', '🍊', '🍐', '🍒', '🍋', '🍌', '🔔'];

module.exports = class SlotsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'slots',
			group: 'games-sp',
			description: 'Play a game of slots.'
		});
	}

	run(msg) {
		const slotOne = Math.floor(Math.random() * slots.length);
		const slotTwo = Math.floor(Math.random() * slots.length);
		const slotThree = Math.floor(Math.random() * slots.length);
		return msg.say(stripIndents`
			**[  🎰 | SLOTS ]**
			------------------
			${this.wrapSlots(slotOne, false)} : ${this.wrapSlots(slotTwo, false)} : ${this.wrapSlots(slotThree, false)}

			${slots[slotOne]} : ${slots[slotTwo]} : ${slots[slotThree]} **<**

			${this.wrapSlots(slotOne, true)} : ${this.wrapSlots(slotTwo, true)} : ${this.wrapSlots(slotThree, true)}
			------------------
			| : : :  **${slotOne === slotTwo && slotOne === slotThree ? 'WIN!' : 'LOST'}**  : : : |
		`);
	}

	wrapSlots(slot, add) {
		if (add) {
			if (slot + 1 > slots.length - 1) return slots[0];
			return slots[slot + 1];
		}
		if (slot - 1 < 0) return slots[slots.length - 1];
		return slots[slot - 1];
	}
};
