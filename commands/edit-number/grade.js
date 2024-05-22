const Command = require('../../framework/Command');

module.exports = class GradeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'grade',
			aliases: ['grade-calculator', 'grade-calc'],
			group: 'edit-number',
			description: 'Determines your grade on an assignment on an 100-point scale.',
			args: [
				{
					key: 'earned',
					label: 'points earned',
					type: 'integer',
					min: 0
				},
				{
					key: 'total',
					label: 'total points',
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
