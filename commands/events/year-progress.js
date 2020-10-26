const Command = require('../../structures/Command');

module.exports = class YearProgressCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'year-progress',
			aliases: ['year', 'year-prog', 'y-progress', 'y-prog'],
			group: 'events',
			memberName: 'year-progress',
			description: 'Responds with the progress of the current year.'
		});
	}

	run(msg) {
        const today = new Date();
        const start = new Date(today.getFullYear(), 0, 1);
        const end = new Date(today.getFullYear() + 1, 0, 1);
        const percent = (Math.abs(today - start) / Math.abs(end - start)) * 100;
        return msg.say(`The year ${now.getFullYear()} is **${percent}%** complete!`);
	}
};
