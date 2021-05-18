const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class CleverbotEndCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cleverbot-end',
			aliases: ['clevs-end', 'chat-end', 'end'],
			group: 'cleverbot',
			memberName: 'cleverbot-end',
			description: 'Ends the current Cleverbot chat.'
		});
	}

	run(msg) {
		if (!this.client.isOwner(msg.author) && !this.client.patreon.isPatron(msg.author.id)) {
			return msg.say(stripIndents`
				You are not currently allowed to use Cleverbot.
				Please visit ${this.client.options.invite} for more information.
			`);
		}
		const cleverbot = this.client.cleverbots.get(msg.channel.id);
		if (!cleverbot) return msg.say('There is not a Cleverbot conversation in this channel.');
		clearTimeout(cleverbot.timeout);
		this.client.cleverbots.delete(msg.channel.id);
		return msg.reply(`Ended the current conversation. Chatted **${cleverbot.interactions}** times.`);
	}
};
