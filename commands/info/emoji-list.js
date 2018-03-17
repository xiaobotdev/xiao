const { Command } = require('discord.js-commando');
const { list } = require('../../util/Util');
const types = ['animated', 'regular'];

module.exports = class EmojiListCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'emoji-list',
			aliases: ['emojis'],
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
					validate: type => {
						if (types.includes(type.toLowerCase())) return true;
						return `Invalid type, please enter either ${list(types, 'or')}.`;
					},
					parse: type => type.toLowerCase()
				}
			]
		});
	}

	run(msg, { type }) {
		const emojis = msg.guild.emojis.filter(emoji => type === 'animated' ? emoji.animated : !emoji.animated);
		if (!emojis.size) return msg.say(`This server has no ${type} custom emoji.`);
		return msg.say(emojis.map(emoji => emoji.toString()).join(' '), { split: { char: ' ' } });
	}
};
