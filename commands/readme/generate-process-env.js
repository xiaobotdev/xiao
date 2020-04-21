const Command = require('../../structures/Command');
const fs = require('fs');
const path = require('path');

module.exports = class GenerateProcessEnvCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'generate-process-env',
			aliases: ['gen-process-env', 'generate-env', 'gen-env'],
			group: 'readme',
			memberName: 'generate-process-env',
			description: 'Generates a backup list of Xiao\'s `process.env`.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			guarded: true
		});
	}

	run(msg) {
		const data = fs.readFileSync(path.join(__dirname, '..', '..', '.env.example'), { encoding: 'utf8' });
		const list = data.split('\n').map(line => {
			if (!line) return '';
			if (line.startsWith('#')) return line;
			line = line.replace('=', '');
			return `${line}="${process.env[line] || ''}"`;
		}).join('\n');
		return msg.say({ files: [{ attachment: Buffer.from(list), name: 'process.env.txt' }] });
	}
};
