const Command = require('../../structures/Command');

module.exports = class FridayThe13thCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'friday-the-13th',
			aliases: ['friday-13th', 'friday-13', 'friday-the-13', 'friday-the-thirteenth', 'friday-thirteenth'],
			group: 'events',
			memberName: 'friday-the-13th',
			description: 'Determines if today is Friday the 13th.',
			credit: [
				{
					name: 'r/IsTodayFridayThe13th',
					url: 'https://www.reddit.com/r/IsTodayFridayThe13th/',
					reason: 'Concept'
				}
			]
		});
	}

	run(msg) {
		const today = new Date();
		const isFridaythe13th = today.getDay() === 5 && today.getDate() === 13;
		return msg.say(`Today **is${isFridaythe13th ? '' : ' not'}** Friday the 13th.`);
	}
};
