const Command = require('../../structures/Command');
const { list, firstUpperCase } = require('../../util/Util');
const months = require('../../assets/json/month');
const stones = require('../../assets/json/birthstone');

module.exports = class BirthstoneCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'birthstone',
			group: 'analyze',
			memberName: 'birthstone',
			description: 'Responds with the Birthstone for a month.',
			args: [
				{
					key: 'month',
					prompt: 'What month would you like to get the birthstone for?',
					type: 'month'
				}
			]
		});
	}

	run(msg, { month }) {
		const stone = stones[month - 1];
		const alternate = stone.alternate ? ` Alternatively, you can also use ${list(stone.alternate, 'or')}.` : '';
		return msg.say(`The Birthstone for ${firstUpperCase(months[month - 1])} is ${stone.primary}.${alternate}`);
	}
};
