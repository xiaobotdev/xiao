const Command = require('../../structures/Command');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const { stripIndents } = require('common-tags');
const { XIAO_GITHUB_REPO_USERNAME, XIAO_GITHUB_REPO_NAME, GITHUB_ACCESS_TOKEN } = process.env;

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

	async run(msg, { command }) {
		if (command === 'git pull') {
			const repo = `${XIAO_GITHUB_REPO_USERNAME}/${XIAO_GITHUB_REPO_NAME}`;
			command = `git pull https://${GITHUB_ACCESS_TOKEN}@github.com/${repo}.git`;
		}
		const results = await this.exec(command);
		return msg.reply(stripIndents`
			_${results.err ? 'An error occurred:' : 'Successfully executed.'}_
			\`\`\`sh
			${results.std}
			\`\`\`
		`);
	}

	async exec(command) {
		try {
			const stdout = await execAsync(command, { timeout: 30000, encoding: 'utf8' });
			return { err: false, std: stdout.trim() };
		} catch (err) {
			return { err: true, std: err.stderr.trim() };
		}
	}
};
