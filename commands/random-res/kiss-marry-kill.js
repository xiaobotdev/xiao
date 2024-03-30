const Command = require('../../framework/Command');
const { shuffle } = require('../../util/Util');

module.exports = class KissMarryKillCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kiss-marry-kill',
			aliases: [
				'kiss-kill-marry',
				'kill-kiss-marry',
				'kill-marry-kiss',
				'marry-kiss-kill',
				'marry-kill-kiss',
				'fuck-marry-kill',
				'fuck-kill-marry',
				'kill-fuck-marry',
				'kill-marry-fuck',
				'marry-fuck-kill',
				'marry-kill-fuck',
				'kmk',
				'kkm',
				'mkk',
				'fmk',
				'mfk',
				'kfm',
				'kmf',
				'fkm',
				'mkf'
			],
			group: 'random-res',
			memberName: 'kiss-marry-kill',
			description: 'Determines who to kiss, who to marry, and who to kill.',
			args: [
				{
					key: 'first',
					label: 'first name',
					type: 'string',
					max: 500
				},
				{
					key: 'second',
					label: 'second name',
					type: 'string',
					max: 500
				},
				{
					key: 'third',
					label: 'third name',
					type: 'string',
					max: 500
				}
			]
		});
	}

	run(msg, { first, second, third }) {
		const kissFuck = msg.channel.nsfw ? 'fuck' : 'kiss';
		const things = shuffle([first, second, third]);
		return msg.say(`I'd ${kissFuck} ${things[0]}, marry ${things[1]}, and kill ${things[2]}.`);
	}
};
