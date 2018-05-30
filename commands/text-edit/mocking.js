const Command = require('../../structures/Command');
const { MOCKING_EMOJI_ID } = process.env;

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
					max: 1950,
					parse: text => text.toLowerCase().split('')
				}
			]
		});
	}

	run(msg, { text }) {
		for (let i = 0; i < text.length; i += Math.floor(Math.random() * 4)) text[i] = text[i].toUpperCase();
		return msg.say(`${text.join('')} <:mocking:${MOCKING_EMOJI_ID}>`);
	}
};

