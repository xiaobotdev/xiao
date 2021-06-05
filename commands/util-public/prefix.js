const Command = require('../../framework/Command');

module.exports = class PrefixCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'prefix',
			group: 'util-public',
			memberName: 'prefix',
			description: 'Responds with the bot\'s command prefix.',
			guarded: true
		});
	}

	run(msg) {
		const prefix = msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix;
		return msg.reply(prefix ? `The command prefix is \`${prefix}\`.` : 'There is no command prefix.');
	}
};
