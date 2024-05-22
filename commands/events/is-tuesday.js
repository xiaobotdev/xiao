const Command = require('../../framework/Command');

module.exports = class IsTuesdayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'is-tuesday',
			aliases: ['is-it-tuesday', 'tuesday'],
			group: 'events',
			description: 'Determines if today is Tuesday.'
		});
	}

	run(msg) {
		return msg.say(`Today **is${new Date().getDay() === 2 ? '' : ' not'}** Tuesday.`);
	}
};
