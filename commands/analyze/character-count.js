const Command = require('../../framework/Command');
const { formatNumber } = require('../../util/Util');
const { Message } = require('discord.js');

module.exports = class CharacterCountCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'character-count',
			aliases: ['characters', 'chars', 'length', 'char-count', 'len'],
			group: 'analyze',
			memberName: 'character-count',
			description: 'Responds with the character count of text.',
			args: [
				{
					key: 'text',
					type: 'message|string'
				}
			]
		});
	}

	run(msg, { text }) {
		if (text instanceof Message) {
			return msg.reply(formatNumber(text.content ? text.content.length : 0));
		}
		return msg.reply(formatNumber(text.length));
	}
};
