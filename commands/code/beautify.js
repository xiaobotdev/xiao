const Command = require('../../structures/Command');
const { js_beautify: beautify } = require('js-beautify');
const { stripIndents } = require('common-tags');

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
					prompt: 'What code do you want to beautify?',
					type: 'code'
				}
			]
		});
	}

	async run(msg, { code }) {
		return msg.reply(stripIndents`
			\`\`\`${code.lang || 'js'}
			${beautify(code.code)}
			\`\`\`
		`);
	}
};
