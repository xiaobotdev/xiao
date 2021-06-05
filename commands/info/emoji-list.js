const Command = require('../../framework/Command');
const { list } = require('../../util/Util');
const types = ['animated', 'regular'];

module.exports = class EmojiListCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'emoji-list',
			aliases: ['emojis', 'emotes', 'emote-list'],
			group: 'info',
			memberName: 'emoji-list',
			description: 'Responds with a list of the server\'s custom emoji.',
			guildOnly: true,
			args: [
				{
					key: 'type',
					prompt: `What type of emoji would you like to view? Either ${list(types, 'or')}.`,
					type: 'string',
					default: 'regular',
					oneOf: types,
					parse: type => type.toLowerCase()
				}
			]
		});
	}

	run(msg, { type }) {
		const emojis = msg.guild.emojis.cache.filter(emoji => type === 'animated' ? emoji.animated : !emoji.animated);
		if (!emojis.size) return msg.say(`This server has no ${type} custom emoji.`);
		return msg.say(emojis.map(emoji => emoji.toString()).sort().join(' '), { split: { char: ' ' } });
	}
};
