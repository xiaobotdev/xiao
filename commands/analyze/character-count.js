const Command = require('../../structures/Command');
const { formatNumber } = require('../../util/Util');
const { Message } = require('discord.js');

module.exports = class CharacterCountCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'character-count',
			aliases: ['characters', 'chars', 'length', 'char-count'],
			group: 'analyze',
			memberName: 'character-count',
			description: 'Responds with the character count of text.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to get the character count of?',
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
