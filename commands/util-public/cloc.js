const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const { formatNumber } = require('../../util/Util');
const { promisify } = require('util');
const exec = promisify(require('child_process').execFile);
const path = require('path');

module.exports = class ClocCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cloc',
			group: 'util-public',
			memberName: 'cloc',
			description: 'Responds with the bot\'s code line count.',
			guarded: true,
			clientPermissions: ['EMBED_LINKS']
		});

		this.cache = null;
	}

	async run(msg) {
		const cloc = await this.cloc();
		const embed = new MessageEmbed()
			.setColor(0x00AE86)
			.setFooter(`${cloc.header.cloc_url} ${cloc.header.cloc_version}`)
			.addField(`❯ JS (${formatNumber(cloc.JavaScript.nFiles)})`, formatNumber(cloc.JavaScript.code), true)
			.addField(`❯ JSON (${formatNumber(cloc.JSON.nFiles)})`, formatNumber(cloc.JSON.code), true)
			.addField(`❯ YAML (${formatNumber(cloc.YAML.nFiles)})`, formatNumber(cloc.YAML.code), true)
			.addField('\u200B', '\u200B', true)
			.addField(`❯ Total (${formatNumber(cloc.SUM.nFiles)})`, formatNumber(cloc.SUM.code), true)
			.addField('\u200B', '\u200B', true);
		return msg.embed(embed);
	}

	async cloc() {
		if (this.cache) return this.cache;
		const { stdout, stderr } = await exec(
			path.join(__dirname, '..', '..', 'node_modules', '.bin', 'cloc'),
			[
				'--json',
				'--exclude-dir=node_modules',
				`--read-lang-def=${path.join(__dirname, '..', '..', 'assets', 'txt', 'txt_definition.txt')}`,
				path.join(__dirname, '..', '..')
			]
		);
		if (stderr) throw new Error(stderr.trim());
		this.cache = JSON.parse(stdout.trim());
		return this.cache;
	}
};
