const Command = require('../../framework/Command');
const UserAgent = require('user-agents');

module.exports = class UserAgentCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'user-agent',
			group: 'random-res',
			description: 'Responds with a random User Agent.'
		});
	}

	run(msg) {
		const agent = new UserAgent();
		return msg.say(agent.toString());
	}
};
