const Command = require('../../structures/Command');
const UserAgent = require('user-agents');

module.exports = class UserAgentCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'user-agent',
			group: 'random-res',
			memberName: 'user-agent',
			description: 'Responds with a random User Agent.'
		});
	}

	run(msg) {
		return msg.say(new UserAgent().toString());
	}
};
