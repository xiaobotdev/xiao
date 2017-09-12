const Command = require('../../structures/Command');

module.exports = class ClapCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'clap',
			aliases: ['clapping'],
			group: 'text-edit',
			memberName: 'clap',
			description: 'Sends 👏 text 👏 like 👏 this.',
			args: [
				{
					key: 'text',
					prompt: 'What 👏 text 👏 would 👏 you 👏 like 👏 to 👏 convert?',
					type: 'string',
					validate: text => {
						if (text.split(' ').join(' 👏 ').length < 2000) return true;
						return 'Your text is too long.';
					}
				}
			]
		});
	}

	run(msg, args) {
		const { text } = args;
		return msg.say(text.split(' ').join(' 👏 '));
	}
};
