const Command = require('../../structures/Command');
const { execSync } = require('child_process');
const { stripIndents } = require('common-tags');

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
					prompt: 'What command do you want to execute?',
					type: 'string'
				}
			]
		});
	}

	run(msg, { command }) {
		const results = this.exec(command);
		return msg.reply(stripIndents`
			_${results.err ? 'Successfully executed.' : 'An error occurred:'}_
			\`\`\`sh
			${results.std}
			\`\`\`
		`);
	}

	exec(command) {
		try {
			const stdout = execSync(command, { timeout: 30000, encoding: 'utf8' });
			return { err: false, std: stdout.trim() };
		} catch (err) {
			return { err: true, std: err.stderr.trim() };
		}
	}
};
