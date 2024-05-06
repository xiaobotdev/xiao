const Command = require('../../framework/Command');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

module.exports = class ExecCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'exec',
			aliases: ['execute', '$'],
			group: 'util',
			memberName: 'exec',
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
		const msgs = this.client.registry.commands.get('eval')
			.makeResultMessages(results.std, results.hrDiff, command, 'sh');
		if (Array.isArray(msgs)) {
			return msgs.map(item => msg.reply(item));
		} else {
			return msg.reply(msgs);
		}
	}

	async exec(command) {
		let hrDiff;
		try {
			const hrStart = process.hrtime();
			const { stdout } = await execAsync(command, { timeout: 30000, encoding: 'utf8' });
			hrDiff = process.hrtime(hrStart);
			return { err: false, std: stdout.trim(), hrDiff };
		} catch (err) {
			return { err: true, std: err.stderr.trim(), hrDiff: null };
		}
	}
};
