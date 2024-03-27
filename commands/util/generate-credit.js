const Command = require('../../framework/Command');

module.exports = class GenerateCreditCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'generate-credit',
			aliases: ['gen-credit', 'generate-cred', 'gen-cred'],
			group: 'util',
			memberName: 'generate-credti',
			description: 'Generates the credits list as a TXT file.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			guarded: true
		});
	}

	async run(msg) {
		const list = this.client.registry.groups
			.map(g => {
				const commands = g.commands.filter(c => !c.hidden && !c.ownerOnly && c.credit.length - 1 !== 0);
				if (!commands.size) return null;
				return commands.map(c => {
					const credits = c.credit
						.filter(cred => cred.name !== 'Dragon Fire')
						.map(cred => `[${cred.name}](${cred.url}) (${cred.reason})`);
					return `* **${c.name}:**\n   - ${credits.join('\n   - ')}`;
				}).join('\n');
			})
			.filter(cmds => cmds);
		await msg.direct({ files: [{ attachment: Buffer.from(list.join('\n')), name: 'credits.txt' }] });
		return msg.say('📬 Sent `credits.txt` to your DMs!');
	}
};
