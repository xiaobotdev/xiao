const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class GenerateCreditCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'generate-credit',
			aliases: ['gen-credit'],
			group: 'owner',
			memberName: 'generate-credit',
			description: 'Generates the credit list for Xiao\'s README.',
			ownerOnly: true,
			guarded: true
		});
	}

	async run(msg) {
		const credit = [];
		const commands = this.client.registry.commands.filter(cmd => cmd.credit && cmd.credit.length > 1);
		for (const command of commands.values()) {
			for (const credit of command.credit) {
				const found = credit.find(c => c.name === credit.name);
				if (found) {
					found.commands.push(command.name);
					continue;
				};
				if (credit.name === 'Dragon Fire') continue;
				credit.push({ ...credit, commands: [command.name] });
			}
		}
		const mapped = credit.map(c => `- [${c.name}](${c.url})\n${c.commands.map(cmd => `	* ${cmd}`).join('\n')}`);
		const { body } = await request
			.post('https://hastebin.com/documents')
			.send(mapped.join('\n'));
		return msg.say(`https://hastebin.com/raw/${body.key}`);
	}
};
