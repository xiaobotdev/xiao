const Command = require('../../structures/Command');
const { default: didYouMean, ReturnTypeEnums } = require('didyoumean2');
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
		if (!msg.guild) return null;
		const commands = this.makeCommandArray(this.client.isOwner(msg.author), msg.channel.nsfw);
		const command = msg.content.match(this.client.dispatcher._commandPatterns[this.client.commandPrefix]);
		const str = command ? command[2] : msg.content.split(' ')[0];
		const results = didYouMean(str, commands, { returnType: ReturnTypeEnums.ALL_SORTED_MATCHES });
		const inGuild = msg.guild ? undefined : null;
		return msg.reply(stripIndents`
			Unknown command. Use ${msg.anyUsage('help', inGuild, inGuild)} to view the command list.

			${results.length ? `Did You Mean: ${results.slice(0, 5).map(c => `\`${c}\``).join(', ')}` : ''}
		`);
	}

	makeCommandArray(owner, nsfw) {
		const arr = [];
		for (const command of this.client.registry.commands.values()) {
			if (!owner && command.ownerOnly) continue;
			if (command.hidden) continue;
			if (!nsfw && command.nsfw) continue;
			if (!command.name.includes('-')) arr.push(command.name);
			arr.push(...command.aliases.filter(alias => !alias.includes('-')));
		}
		return arr;
	}
};
