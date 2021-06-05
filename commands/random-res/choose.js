const Command = require('../../framework/Command');

module.exports = class ChooseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'choose',
			aliases: ['pick'],
			group: 'random-res',
			memberName: 'choose',
			description: 'Chooses between options you provide.',
			args: [
				{
					key: 'choices',
					prompt: 'What choices do you want me pick from?',
					type: 'string',
					infinite: true,
					max: 1950
				}
			]
		});
	}

	run(msg, { choices }) {
		return msg.say(`I choose ${choices[Math.floor(Math.random() * choices.length)]}!`);
	}
};
