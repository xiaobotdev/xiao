const Command = require('../../structures/Command');

module.exports = class ChooseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'choose',
			group: 'random-res',
			memberName: 'choose',
			description: 'Chooses between options you provide.',
			args: [
				{
					key: 'choices',
					prompt: 'What choices do you want me pick from?',
					type: 'string',
					infinite: true
				}
			]
		});
	}

	run(msg, args) {
		const { choices } = args;
		return msg.say(`I choose ${choices[Math.floor(Math.random() * choices.length)]}!`);
	}
};
