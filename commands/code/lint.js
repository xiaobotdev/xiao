const Command = require('../../structures/Command');
const { Linter } = require('eslint');
const linter = new Linter();
const { stripIndents } = require('common-tags');
const { trimArray } = require('../../util/Util');
const { goodMessages, badMessages, defaultConfig } = require('../../assets/json/lint');

module.exports = class LintCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lint',
			aliases: ['eslint'],
			group: 'code',
			memberName: 'lint',
			description: 'Lints code using ESLint.',
			clientPermissions: ['READ_MESSAGE_HISTORY'],
			args: [
				{
					key: 'code',
					prompt: 'What code do you want to lint?',
					type: 'code'
				}
			]
		});
	}

	async run(msg, { code }) {
		if (!code.lang || ['js', 'javascript'].includes(code.lang)) {
			const errors = linter.verify(code.code, defaultConfig);
			if (!errors.length) return msg.reply(goodMessages[Math.floor(Math.random() * goodMessages.length)]);
			const errorMap = trimArray(errors.map(err => `\`[${err.line}:${err.column}] ${err.message}\``));
			return msg.reply(stripIndents`
				${badMessages[Math.floor(Math.random() * badMessages.length)]}
				${errorMap.join('\n')}
			`);
		}
		if (code.lang === 'json') {
			try {
				JSON.parse(code.code);
				return msg.reply(goodMessages[Math.floor(Math.random() * goodMessages.length)]);
			} catch (err) {
				return msg.reply(stripIndents`
					${badMessages[Math.floor(Math.random() * badMessages.length)]}
					\`${err.name}: ${err.message}\`
				`);
			}
		}
		return msg.reply('I don\'t know how to lint that language.');
	}
};
