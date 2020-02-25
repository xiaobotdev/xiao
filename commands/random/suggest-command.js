const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class SuggestCommandCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'suggest-command',
			aliases: ['command-suggestion', 'command-suggest'],
			group: 'random',
			memberName: 'suggest-command',
			description: 'Suggests a random command for you to try.'
		});
	}

	run(msg) {
		const command = this.client.registry.commands.random();
		return msg.say(stripIndents`
			Have you tried **${command.name}**?
			_${command.description}_
		`);
	}
};
