const { Command } = require('discord.js-commando');

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
					infinite: true
				}
			]
		});
	}

	run(msg, { choices }) {
		return msg.say(`I choose ${choices[Math.floor(Math.random() * choices.length)]}!`);
	}
};
