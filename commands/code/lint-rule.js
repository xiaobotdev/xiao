const Command = require('../../framework/Command');
const { MessageEmbed } = require('discord.js');
const logos = require('../../assets/json/logos');
const { Linter } = require('eslint');
const linter = new Linter();
const rules = linter.getRules();

module.exports = class LintRuleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lint-rule',
			aliases: ['eslint-rule', 'linter-rule'],
			group: 'code',
			memberName: 'lint-rule',
			description: 'Responds with information on an ESLint rule.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'rule',
					type: 'string',
					parse: rule => rule.toLowerCase().replaceAll(' ', '-')
				}
			]
		});
	}

	run(msg, { rule }) {
		if (!rules.has(rule)) return msg.say('Could not find any results.');
		const data = rules.get(rule).meta;
		const embed = new MessageEmbed()
			.setAuthor('ESLint', logos.eslint, 'https://eslint.org/')
			.setColor(0x3A33D1)
			.setTitle(rule)
			.setURL(data.docs.url)
			.setDescription(data.docs.description);
		return msg.embed(embed);
	}
};
