const { Command } = require('discord.js-commando');
const { shuffle } = require('../../util/Util');

module.exports = class KissMarryKillCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kiss-marry-kill',
			aliases: ['kiss-kill-marry', 'kill-kiss-marry', 'kill-marry-kiss', 'marry-kiss-kill', 'marry-kill-kiss'],
			group: 'random-res',
			memberName: 'kiss-marry-kill',
			description: 'Decides who to kiss, who to marry, and who to kill.',
			args: [
				{
					key: 'thing1',
					label: 'first name',
					prompt: 'Who is the first person you choose?',
					type: 'string',
					max: 500
				},
				{
					key: 'thing2',
					label: 'second name',
					prompt: 'Who is the second person you choose?',
					type: 'string',
					max: 500
				},
				{
					key: 'thing3',
					label: 'third name',
					prompt: 'Who is the third person you choose?',
					type: 'string',
					max: 500
				}
			]
		});
	}

	run(msg, { thing1, thing2, thing3 }) {
		const things = shuffle([thing1, thing2, thing3]);
		return msg.say(`I'd kiss ${things[0]}, marry ${things[1]}, and kill ${things[2]}.`);
	}
};
