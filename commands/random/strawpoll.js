const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const snekfetch = require('snekfetch');

module.exports = class StrawpollCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'strawpoll',
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
						return 'Title must be under 200 characters.';
					}
				},
				{
					key: 'options',
					prompt: 'What options do you want to be able to pick from? Maximum of 30.',
					type: 'string',
					infinite: true,
					validate: choice => {
						if (choice.length < 140) return true;
						return 'Choices must be under 140 characters each.';
					}
				}
			]
		});
	}

	async run(msg, args) {
		const { title, options } = args;
		if (options.length < 2) return msg.say('You provided less than two choices.');
		if (options.length > 31) return msg.say('You provided more than thirty choices.');
		const { body } = await snekfetch
			.post('https://strawpoll.me/api/v2/polls')
			.send({ title, options });
		return msg.say(stripIndents`
			${body.title}
			http://strawpoll.me/${body.id}
		`);
	}
};
