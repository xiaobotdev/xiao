const Command = require('../../framework/Command');

module.exports = class HelloWorldCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hello-world',
			group: 'single',
			description: 'Hello world!'
		});
	}

	run(msg) {
		return msg.say('Hello, world!');
	}
};
