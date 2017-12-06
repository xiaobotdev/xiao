const { Command } = require('discord.js-commando');

module.exports = class HelloWorldCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hello-word',
			aliases: ['hola-mundo'],
			group: 'single',
			memberName: 'hello-world',
			description: 'Hello world.'
		});
	}

	run(msg) {
		return msg.say('Hello World!');
	}
};
