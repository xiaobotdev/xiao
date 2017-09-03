const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const snekfetch = require('snekfetch');

module.exports = class StrawpollCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'strawpoll',
			aliases: ['poll'],
			group: 'random',
			memberName: 'strawpoll',
			description: 'Creates a Strawpoll from the options you provide.',
			args: [
				{
					key: 'title',
					prompt: 'What would you like the title of the Strawpoll to be?',
					type: 'string',
					validate: title => {
						if (title.length < 200) return true;
						return 'Please keep the title under 200 characters.';
					}
				},
				{
					key: 'options',
					prompt: 'What options do you want to be able to pick from? Maximum of 30.',
					type: 'string',
					infinite: true,
					validate: choice => {
						if (choice.length < 140) return true;
						return 'Please keep choices under 140 characters each.';
					}
				}
			]
		});
	}

	async run(msg, args) {
		const { title, options } = args;
		if (options.length < 2) return msg.say('Please provide more than one choice.');
		if (options.length > 31) return msg.say('Please provide thirty or less choices.');
		try {
			const { body } = await snekfetch
				.post('https://www.strawpoll.me/api/v2/polls')
				.set({ 'Content-Type': 'application/json' })
				.send({ title, options });
			return msg.say(stripIndents`
				${body.title}
				http://www.strawpoll.me/${body.id}
			`);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
