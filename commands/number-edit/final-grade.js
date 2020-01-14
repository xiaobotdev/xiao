const Command = require('../../structures/Command');
const { above100, above92, above88, above80, below80 } = require('../../assets/json/final-grade');

module.exports = class FinalGradeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'final-grade',
			aliases: ['final-grade-calculator', 'final-grade-calc'],
			group: 'number-edit',
			memberName: 'final-grade',
			description: 'Determines the grade you need to make on your final to get your desired course grade.',
			credit: [
				{
					name: 'RogerHub Final Grade Calculator',
					url: 'https://rogerhub.com/final-grade-calculator/',
					reason: 'Concept, Code'
				}
			],
			args: [
				{
					key: 'current',
					label: 'current grade',
					prompt: 'What is your current grade in the class?',
					type: 'integer',
					min: 0
				},
				{
					key: 'desired',
					label: 'desired grade',
					prompt: 'What is the minimum grade you want in the class?',
					type: 'integer',
					min: 0
				},
				{
					key: 'weight',
					prompt: 'What percentage of your grade is the final worth?',
					type: 'integer',
					max: 100,
					min: 0
				}
			]
		});
	}

	run(msg, { current, desired, weight }) {
		const required = Math.round((((desired / 100) - ((current / 100) * (1 - (weight / 100)))) / (weight / 100)) * 100);
		const diff = desired - current;
		let text;
		if (required > 100) text = above100[Math.floor(Math.random() * above100.length)];
		else if (required > 92 || diff > weight * 0.3) text = above92[Math.floor(Math.random() * above92.length)];
		else if (required > 88 || diff > 0) text = above88[Math.floor(Math.random() * above88.length)];
		else if (required > 80 || diff > weight * -0.3) text = above80[Math.floor(Math.random() * above80.length)];
		else text = below80[Math.floor(Math.random() * below80.length)];
		return msg.say(`You will need to score at least ${required}% on your final to get a ${desired}% overall. ${text}`);
	}
};
