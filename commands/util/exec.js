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
		const { stdout, stderr } = execSync(command);
		if (stderr) return { err: true, std: stderr.trim() };
		return { err: false, std: stdout.trim() };
	}
};
