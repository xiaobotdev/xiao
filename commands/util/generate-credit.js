const Command = require('../../framework/Command');
const { embedURL } = require('../../util/Util');
const { dependencies, optionalDependencies } = require('../../package');
const deps = Object.keys({ ...dependencies, ...optionalDependencies }).sort();

module.exports = class GenerateCreditCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'generate-credit',
			aliases: ['gen-credit', 'generate-cred', 'gen-cred'],
			group: 'util',
			description: 'Generates the credits list as a TXT file.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			guarded: true
		});
	}

	async run(msg) {
		const npm = `* ${deps.map(dep => embedURL(dep, `https://www.npmjs.com/package/${dep}`)).join('\n* ')}`;
		const list = this.client.registry.groups
			.map(g => {
				const commands = g.commands
					.filter(c => !c.hidden && !c.ownerOnly && c.credit.length - 1 !== 0)
					.sort((a, b) => a.name.localeCompare(b.name));
				if (!commands.size) return null;
				return commands.map(c => {
					const credits = c.credit
						.filter(cred => cred.name !== 'Lily is Silly')
						.map(cred => {
							const reason = cred.reasonURL ? embedURL(cred.reason, cred.reasonURL) : cred.reason;
							return `${embedURL(cred.name, cred.url)} (${reason})`;
						});
					return `* **${c.name}:**\n   - ${credits.join('\n   - ')}`;
				}).join('\n');
			})
			.filter(cmds => cmds);
		const file = Buffer.from(`## Credits\n### NPM Packages\n${npm}\n\n### Other Credits\n${list.join('\n')}`);
		if (msg.guild) await msg.say('📬 Sent `credits.txt` to your DMs!');
		return msg.direct({ files: [{ attachment: file, name: 'credits.txt' }] });
	}
};
