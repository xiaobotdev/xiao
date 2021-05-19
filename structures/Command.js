const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');

module.exports = class XiaoCommand extends Command {
	constructor(client, info) {
		if (!info.argsPromptLimit) info.argsPromptLimit = 2;
		super(client, info);

		this.patronOnly = info.patronOnly || false;
		this.argsSingleQuotes = info.argsSingleQuotes || false;
		this.throttling = info.unknown ? null : info.throttling || { usages: 2, duration: 5 };
		this.uses = 0;
		this.lastRun = null;
		this.credit = info.credit || [];
		this.credit.push({
			name: 'Dragon Fire',
			url: 'https://github.com/dragonfire535',
			reason: 'Code'
		});
	}

	hasPermission(msg) {
		if (this.patronOnly && !this.client.patreon.isPatron(msg.author.id)) {
			return stripIndents`
				The \`${this.name}\` command can only be used by Patrons.
				Visit <https://www.patreon.com/xiaodiscord> to sign-up!
			`;
		}
		return super.hasPermission(msg);
	}
};
