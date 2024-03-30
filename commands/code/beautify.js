const Command = require('../../framework/Command');
const { js_beautify: beautify } = require('js-beautify');

module.exports = class BeautifyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'beautify',
			aliases: ['js-beautify'],
			group: 'code',
			memberName: 'beautify',
			description: 'Beautifies code with js-beautify.',
			clientPermissions: ['READ_MESSAGE_HISTORY'],
			args: [
				{
					key: 'code',
					type: 'code'
				}
			]
		});
	}

	run(msg, { code }) {
		if (code.lang && code.lang !== 'js') return msg.reply('I can only beautify JavaScript.');
		return msg.reply(`\`\`\`js\n${beautify(code.code)}\n\`\`\``);
	}
};
