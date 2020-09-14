const Command = require('../../structures/Command');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

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
		const results = await this.exec(command);
		return msg.code('sh', results);
	}

	async exec(command) {
		const { stdout, stderr } = await exec(command);
		if (stderr) return stderr.trim();
		return stdout.trim();
	}
};
