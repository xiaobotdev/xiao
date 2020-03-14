const Command = require('../../structures/Command');
const request = require('node-superfetch');

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
			guarded: true,
			credit: [
				{
					name: 'Hastebin',
					url: 'https://hastebin.com/about.md',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		const list = this.client.registry.groups
			.map(g => `\n### ${g.name}:\n\n${g.commands.filter(c => !c.hidden).map(
				c => `* **${c.name}:** ${c.description}${c.ownerOnly ? ' (Owner-Only)' : ''}${c.nsfw ? ' (NSFW)' : ''}`
			).join('\n')}`);
		const { body } = await request
			.post('https://hastebin.com/documents')
			.send(`Total: ${this.client.registry.commands.size}\n${list.join('\n')}`);
		return msg.say(`https://hastebin.com/raw/${body.key}`);
	}
};
