const Command = require('../../framework/Command');

module.exports = class GenerateCommandsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'generate-commands',
			aliases: ['gen-commands', 'generate-cmds', 'gen-cmds'],
			group: 'util',
			memberName: 'generate-commands',
			description: 'Generates the commands list as a TXT file.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			guarded: true
		});
	}

	async run(msg) {
		const list = this.client.registry.groups
			.map(g => {
				const commands = g.commands
					.filter(c => !c.hidden && !c.ownerOnly)
					.sort((a, b) => a.name.localeCompare(b.name));
				if (!commands.size) return null;
				const mapped = commands.map(c => {
					const nsfw = c.nsfw ? ` (NSFW)` : '';
					return `* **${c.name}:** ${c.description}${nsfw}`;
				});
				return `\n### ${g.name}:\n\n${mapped.join('\n')}`;
			})
			.filter(cmds => cmds);
		const text = `Total: ${this.client.registry.commands.size}\n${list.join('\n')}`;
		if (msg.guild) await msg.say('📬 Sent `commands.txt` to your DMs!');
		return msg.direct({ files: [{ attachment: Buffer.from(text), name: 'commands.txt' }] });
	}
};
