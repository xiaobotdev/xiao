const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { randomRange } = require('../../util/Util');

module.exports = class FakePollCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fake-poll',
			aliases: ['phony-poll', 'f-poll'],
			group: 'random-res',
			memberName: 'fake-poll',
			description: 'Randomly polls a bunch of fake users for their opinion on a yes/no question.',
			args: [
				{
					key: 'question',
					prompt: 'What do you want to ask?',
					type: 'string',
					max: 500
				}
			]
		});
	}

	run(msg, { question }) {
		const { results, amount } = this.poll();
		return msg.say(stripIndents`
			We asked **${amount}** people the question: _${question}_

			Yes: **${results.yes}**
			No: **${results.no}**
		`);
	}

	poll() {
		const results = { yes: 0, no: 0 }; 
		const seed = Math.floor(Math.random() * 5) + 2;
		const shouldYes = Math.floor(Math.random() * 5) + 2;
		const amount = randomRange(100, 1000);
		for (let i = 0; i < amount; i++) {
			const random = Math.floor(Math.random() * seed);
			if (random % shouldYes) results.yes++;
			else results.no++;
		}
		return { results, amount };
	}
};
