const Command = require('../../framework/Command');

module.exports = class GradeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'grade',
			aliases: ['grade-calculator', 'grade-calc'],
			group: 'edit-number',
			memberName: 'grade',
			description: 'Determines your grade on an assignment on an 100-point scale.',
			args: [
				{
					key: 'earned',
					label: 'points earned',
					prompt: 'How many points did you get?',
					type: 'integer',
					min: 0
				},
				{
					key: 'total',
					label: 'total points',
					prompt: 'How many points are available to recieve?',
					type: 'integer',
					min: 0
				}
			]
		});
	}

	run(msg, { earned, total }) {
		const score = Math.round((earned / total) * 100);
		return msg.reply(`Your score is a **${score}%**${score >= 70 ? '! Nice job!' : '... Too bad...'}`);
	}
};
