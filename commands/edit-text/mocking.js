const Command = require('../../framework/Command');
const { MOCKING_EMOJI_ID, MOCKING_EMOJI_NAME } = process.env;

module.exports = class MockingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'mocking',
			aliases: ['mock'],
			group: 'edit-text',
			memberName: 'mocking',
			description: 'SenDs TexT lIkE ThiS.',
			args: [
				{
					key: 'text',
					type: 'string',
					max: 1950,
					parse: text => text.toLowerCase()
				}
			]
		});
	}

	run(msg, { text }) {
		const canEmoji = msg.guild
			? msg.channel.permissionsFor(this.client.user).has('USE_EXTERNAL_EMOJIS')
			: true;
		const letters = text.split('');
		for (let i = 0; i < letters.length; i += Math.floor(Math.random() * 4)) {
			letters[i] = letters[i].toUpperCase();
		}
		return msg.say(`${letters.join('')}${canEmoji ? this.mockingEmoji : ''}`);
	}

	get mockingEmoji() {
		return MOCKING_EMOJI_ID && MOCKING_EMOJI_NAME ? ` <:${MOCKING_EMOJI_NAME}:${MOCKING_EMOJI_ID}>` : '';
	}
};
