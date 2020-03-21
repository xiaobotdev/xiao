const Command = require('../../structures/Command');

module.exports = class GenerateCommandsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'generate-commands',
			aliases: ['gen-commands'],
			group: 'readme',
			memberName: 'generate-commands',
			description: 'Generates the commands list for Xiao\'s README.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			guarded: true
		});
	}

	run(msg) {
		const list = this.client.registry.groups
			.map(g => `\n### ${g.name}:\n\n${g.commands.filter(c => !c.hidden).map(
				c => `* **${c.name}:** ${c.description}${c.ownerOnly ? ' (Owner-Only)' : ''}${c.nsfw ? ' (NSFW)' : ''}`
			).join('\n')}`);
		return msg.channel.send({ files: [{ attachment: Buffer.from(list), name: 'commands.txt' }] });
	}
};
