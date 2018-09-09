const Command = require('../../structures/Command');
const { letterTrans } = require('custom-translate');
const dictionary = require('../../assets/json/upside-down');

module.exports = class UpsideDownCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'upside-down',
			aliases: ['u-down'],
			group: 'text-edit',
			memberName: 'upside-down',
			description: 'Flips text upside-down.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to flip upside-down?',
					type: 'string'
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(letterTrans(text, dictionary).split('').reverse().join(''));
	}
};
