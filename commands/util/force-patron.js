const Command = require('../../structures/Command');

module.exports = class ForcePatronCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'force-patron',
			group: 'util',
			memberName: 'force-patron',
			description: 'Allows a user to use patron-only commands.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			guarded: true,
			args: [
				{
					key: 'target',
					prompt: 'Who do you want to allow? Use the ID.',
					type: 'string'
				}
			]
		});
	}

	run(msg, { target }) {
		if (this.client.patreon.isPatron(target)) return msg.say(`💸 \`${target}\` is already a patron.`);
		this.client.patreon.forced.push(target);
		this.client.patreon.exportForced();
		return msg.say(`💸 Allowed \`${target}\` to use patron-only commands.`);
	}
};
