const Command = require('../../framework/Command');
const { EmbedBuilder } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = class HelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'help',
			aliases: ['commands', 'command-list'],
			group: 'util-public',
			description: 'Displays a list of available commands, or detailed information for a specific command.',
			guarded: true,
			args: [
				{
					key: 'command',
					type: 'command',
					default: ''
				}
			]
		});
	}

	async run(msg, { command }) {
		if (!command) {
			const embeds = [];
			for (let i = 0; i < Math.ceil(this.client.registry.groups.size / 10); i++) {
				const nsfw = msg.channel.nsfw || this.client.isOwner(msg.author);
				const embed = new EmbedBuilder()
					.setTitle(`Command List (Page ${i + 1})`)
					.setDescription(stripIndents`
						To see help for a specific command, use ${this.usage()}.
						${nsfw ? '' : '_NSFW commands are hidden._'}
					`)
					.setColor(0x00AE86);
				embeds.push(embed);
			}
			let cmdCount = 0;
			let i = 0;
			let embedIndex = 0;
			for (const group of this.client.registry.groups.values()) {
				i++;
				const owner = this.client.isOwner(msg.author);
				const commands = group.commands.filter(cmd => {
					if (owner) return true;
					if (cmd.ownerOnly || cmd.hidden) return false;
					if (cmd.nsfw && !msg.channel.nsfw) return false;
					return true;
				}).sort((a, b) => a.name.localeCompare(b.name));
				if (!commands.size) continue;
				cmdCount += commands.size;
				if (i > (embedIndex * 10) + 10) embedIndex++;
				embeds[embedIndex].addField(`❯ ${group.name}`, commands.map(cmd => `\`${cmd.name}\``).join(' '));
			}
			const allShown = cmdCount === this.client.registry.commands.size;
			embeds[embeds.length - 1]
				.setFooter({ text: `${this.client.registry.commands.size} Commands${allShown ? '' : ` (${cmdCount} Shown)`}` });
			try {
				const msgs = [];
				for (const embed of embeds) msgs.push(await msg.direct({ embeds: [embed] }));
				if (msg.guild) msgs.push(await msg.say('📬 Sent you a DM with information.'));
				return msgs;
			} catch {
				return msg.reply('Failed to send DM. You probably have DMs disabled.');
			}
		}
		let cmdHelpText = `__Command **${command.name}**__`;
		if (command.guildOnly) cmdHelpText += ' (Usable only in servers)';
		if (command.nsfw) cmdHelpText += ' (NSFW)';
		cmdHelpText += `\n${command.description}\n`;
		if (command.details) cmdHelpText += `${command.details}\n`;
		cmdHelpText += '\n';
		if (command.flags.length) {
			const flags = command.flags.map(flag => `--${flag.key} (${flag.description})`).join('\n');
			cmdHelpText += `**Flags:**\n${flags}\n`;
		}
		cmdHelpText += `**Format:** ${command.usage()}\n`;
		cmdHelpText += `**Example:** ${command.example(msg)}\n`;
		if (command.aliases.length) cmdHelpText += `**Aliases:** ${command.aliases.join(', ')}\n`;
		cmdHelpText += `**Group:** ${command.group.name}\n`;
		return msg.say(cmdHelpText);
	}
};
