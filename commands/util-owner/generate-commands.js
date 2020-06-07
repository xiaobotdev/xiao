const Command = require('../../structures/Command');

module.exports = class GenerateCommandsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'generate-commands',
			aliases: ['gen-commands', 'generate-cmds', 'gen-cmds'],
			group: 'util-owner',
			memberName: 'generate-commands',
			description: 'Generates the commands list for Xiao\'s README.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			guarded: true
		});
	}

	async run(msg) {
		const list = this.client.registry.groups
			.map(g => {
				const commands = g.commands.filter(c => !c.hidden);
				return `\n### ${g.name}:\n\n${commands.map(c => {
					const extra = `${c.ownerOnly ? ' (Owner-Only)' : ''}${c.nsfw ? ' (NSFW)' : ''}`;
					return `* **${c.name}:** ${c.description}${extra}`;
				}).join('\n')}`;
			});
		const text = `Total: ${this.client.registry.commands.size}\n${list.join('\n')}`;
		await msg.direct({ files: [{ attachment: Buffer.from(text), name: 'commands.txt' }] });
		return msg.say('📬 Sent `commands.txt` to your DMs!');
	}
};
