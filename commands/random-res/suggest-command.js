const Command = require('../../framework/Command');
const { stripIndents } = require('common-tags');

module.exports = class SuggestCommandCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'suggest-command',
			aliases: ['command-suggestion', 'command-suggest', 'suggest-cmd', 'cmd-suggest'],
			group: 'random-res',
			memberName: 'suggest-command',
			description: 'Suggests a random command for you to try.'
		});
	}

	run(msg) {
		const command = this.client.registry.commands
			.filter(cmd => {
				if (cmd.hidden || cmd.unknown || cmd.ownerOnly) return false;
				if (!msg.channel.nsfw && cmd.nsfw) return false;
				if (!msg.guild && cmd.guildOnly) return false;
				return true;
			})
			.random();
		return msg.say(stripIndents`
			Have you tried **${command.name}**?
			_${command.description}_
		`);
	}
};
