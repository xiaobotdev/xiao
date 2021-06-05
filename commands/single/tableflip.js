const Command = require('../../framework/Command');
const { delay } = require('../../util/Util');
const frames = [
	'(-°□°)-  ┬─┬',
	'(╯°□°)╯    ]',
	'(╯°□°)╯  ︵  ┻━┻',
	'(╯°□°)╯       [',
	'(╯°□°)╯           ┬─┬'
];

module.exports = class TableflipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tableflip',
			aliases: ['a-tableflip', 'animated-tableflip'],
			group: 'single',
			memberName: 'tableflip',
			description: 'Flips a table... With animation!'
		});
	}

	async run(msg) {
		const message = await msg.say('(\\\\°□°)\\\\  ┬─┬');
		for (const frame of frames) {
			await delay(100);
			await message.edit(frame);
		}
		return message;
	}
};
