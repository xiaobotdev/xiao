const Command = require('../../structures/Command');

module.exports = class MockingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'mocking',
			aliases: ['mock'],
			group: 'text-edit',
			memberName: 'mocking',
			description: 'SenDs TexT lIkE ThiS.',
			clientPermissions: ['USE_EXTERNAL_EMOJIS'],
			args: [
				{
					key: 'text',
					prompt: 'WHaT tEXt WoUlD yOu LiKE to COnvErt?',
					type: 'string',
					validate: text => {
						if (text.length < 1950) return true;
						return 'Invalid text, please keep the text under 1950 characters.';
					},
					parse: text => text.toLowerCase().split('')
				}
			]
		});
	}

	run(msg, args) {
		const { text } = args;
		for (let i = 0; i < text.length; i += Math.floor(Math.random() * 4)) text[i] = text[i].toUpperCase();
		return msg.say(`${text.join('')} <:sponge:318612443398144000>`);
	}
};

