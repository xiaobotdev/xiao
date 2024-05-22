const Command = require('../../framework/Command');
const { stripIndents } = require('common-tags');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const { splitMessage } = require('../../util/Util');

module.exports = class ExecCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'exec',
			aliases: ['execute', '$'],
			group: 'util',
			description: 'Executes a command-line application.',
			ownerOnly: true,
			guarded: true,
			args: [
				{
					key: 'command',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { command }) {
		const results = await this.exec(command);
		const msgs = this.makeResultMessages(results.std, results.hrDiff);
		if (Array.isArray(msgs)) {
			return msgs.map(item => msg.reply(item));
		} else {
			return msg.reply(msgs);
		}
	}

	async exec(command) {
		let hrDiff;
		const hrStart = process.hrtime();
		try {
			const { stdout } = await execAsync(command, { timeout: 30000, encoding: 'utf8' });
			hrDiff = process.hrtime(hrStart);
			return { err: false, std: stdout.trim(), hrDiff };
		} catch (err) {
			hrDiff = process.hrtime(hrStart);
			return { err: true, std: err.stderr.trim(), hrDiff };
		}
	}

	makeResultMessages(result, hrDiff) {
		const prepend = `\`\`\`sh\n`;
		const append = `\n\`\`\``;
		return splitMessage(stripIndents`
			*Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.*
			\`\`\`sh
			${result}
			\`\`\`
		`, { maxLength: 1900, prepend, append });
	}
};
