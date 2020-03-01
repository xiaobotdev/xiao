const Command = require('../../structures/Command');
const meant = require('meant');
const { stripIndents } = require('common-tags');

module.exports = class UnknownCommandCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'unknown-command',
			group: 'util',
			memberName: 'unknown-command',
			description: 'Displays help information for when an unknown command is used.',
			unknown: true,
			hidden: true,
			guarded: true
		});
	}

	run(msg) {
		const commands = this.client.registry.commands.map(c => c.name);
		const command = msg.content.match(this.client.dispatcher._commandPatterns[this.client.commandPrefix]);
		const didYouMean = meant(command ? command[2] : msg.content.split(' ')[0], commands);
		const inGuild = msg.guild ? undefined : null;
		return msg.reply(stripIndents`
			Unknown command. Use ${msg.anyUsage('help', inGuild, inGuild)} to view the command list.

			${didYouMean && didYouMean.length ? `Did You Mean:\n${didYouMean.map(c => `\`${c}\``).join(',')}` : ''}
		`);
	}
};
