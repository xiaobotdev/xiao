const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class GenerateCreditCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'generate-credit',
			aliases: ['gen-credit'],
			group: 'readme',
			memberName: 'generate-credit',
			description: 'Generates the credit list for Xiao\'s README.',
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
		let credit = [];
		const commands = this.client.registry.commands.filter(cmd => cmd.credit && cmd.credit.length > 1);
		for (const command of commands.values()) {
			for (const cred of command.credit) {
				const found = credit.find(c => c.name === cred.name);
				if (found) {
					found.commands.push({
						name: command.name,
						reason: cred.reason,
						reasonURL: cred.reasonURL
					});
					continue;
				}
				if (cred.name === 'Dragon Fire') continue;
				credit.push({
					name: cred.name,
					url: cred.url,
					commands: [{
						name: command.name,
						reason: cred.reason,
						reasonURL: cred.reasonURL
					}]
				});
			}
		}
		credit = credit.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
		const mapped = credit
			.map(c => `- [${c.name}](${c.url})\n${c.commands.map(cmd => {
				if (!cmd.reasonURL) return `	* ${cmd.name} (${cmd.reason})`;
				return `	* ${cmd.name} ([${cmd.reason}](${cmd.reasonURL}))`;
			}).join('\n')}`);
		const { body } = await request
			.post('https://hastebin.com/documents')
			.send(mapped.join('\n'));
		return msg.say(`https://hastebin.com/raw/${body.key}`);
	}
};
