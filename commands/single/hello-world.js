const Command = require('../../structures/Command');

module.exports = class HelloWorldCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hello-world',
			group: 'single',
			memberName: 'hello-world',
			description: 'Hello world!'
		});
	}

	run(msg) {
		return msg.say('Hello, world!');
	}
};
