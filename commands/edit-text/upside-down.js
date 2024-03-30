const Command = require('../../framework/Command');
const { letterTrans } = require('custom-translate');
const dictionary = require('../../assets/json/upside-down');

module.exports = class UpsideDownCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'upside-down',
			aliases: ['u-down'],
			group: 'edit-text',
			memberName: 'upside-down',
			description: 'Flips text upside-down.',
			args: [
				{
					key: 'text',
					type: 'string'
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(letterTrans(text, dictionary).split('').reverse().join(''));
	}
};
