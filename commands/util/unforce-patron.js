const Command = require('../../structures/Command');
const { removeFromArray } = require('../../util/Util');

module.exports = class UnforcePatronCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'unforce-patron',
			group: 'util',
			memberName: 'unforce-patron',
			description: 'Disallows a user from using patron-only commands.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			guarded: true,
			args: [
				{
					key: 'target',
					prompt: 'Who do you want to disallow? Use the ID.',
					type: 'string'
				}
			]
		});
	}

	run(msg, { target }) {
		if (!this.client.patreon.isPatron(target)) return msg.say(`💸 \`${target}\` is not a patron.`);
		removeFromArray(this.client.patreon.forced, target);
		this.client.patreon.exportForced();
		return msg.say(`💸 Disallowed \`${target}\` from using patron-only commands.`);
	}
};
