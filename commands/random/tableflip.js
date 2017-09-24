const Command = require('../../structures/Command');
const { wait } = require('../../structures/Util');
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
			group: 'random',
			memberName: 'tableflip',
			description: 'Flips a table... With animation!'
		});
	}

	async run(msg) {
		const message = await msg.say('(\\\\°□°)\\\\  ┬─┬');
		for (const frame of frames) {
			await wait(300);
			await message.edit(frame);
		}
		return message;
	}
};
