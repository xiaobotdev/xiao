const Command = require('../../framework/Command');
const { formatNumber } = require('../../util/Util');

module.exports = class FormatNumberCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'format-number',
			aliases: ['format-num', 'pretty-number', 'pretty-num', 'number', 'num'],
			group: 'edit-number',
			memberName: 'format-number',
			description: 'Formats a number to look more readable.',
			args: [
				{
					key: 'number',
					prompt: 'What number do you want to format?',
					type: 'float'
				}
			]
		});
	}

	run(msg, { number }) {
		return msg.reply(formatNumber(number));
	}
};
