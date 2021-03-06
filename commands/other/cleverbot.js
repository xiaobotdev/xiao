const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class CleverbotCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cleverbot',
			aliases: ['clevs', 'chat'],
			group: 'other',
			memberName: 'cleverbot',
			description: 'Starts a Cleverbot conversation.',
			credit: [
				{
					name: 'Cleverbot',
					url: 'https://www.cleverbot.com/',
					reason: 'API',
					reasonURL: 'https://www.cleverbot.com/api/'
				}
			]
		});
	}

	run(msg) {
		if (this.client.cleverbots.has(msg.channel.id)) {
			return msg.say('There is already a Cleverbot conversation in this channel.');
		}
		const usage = this.client.registry.commands.get('cleverbot-end').usage();
		return msg.reply(stripIndents`
			Cleverbot is now active in this channel, replying to ${msg.author}.
			To end the conversation, use ${usage}.
		`);
	}
};
