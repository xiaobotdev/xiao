const Command = require('../../structures/Command');
const path = require('path');
const { list } = require('../../util/Util');
const types = ['default', 'moth', 'jojo'];

module.exports = class DarkLightCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dark-light',
			aliases: ['dark-theme-light-theme', 'light-theme-dark-theme', 'dark-theme', 'light-theme', 'dtlt'],
			group: 'single',
			memberName: 'dark-light',
			description: 'Determines whether you use dark or light theme.',
			details: `**Types:** ${types.join(', ')}`,
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'u/LennyMcLennington',
					url: 'https://www.reddit.com/user/LennyMcLennington',
					reason: 'Image',
					reasonURL: 'https://www.reddit.com/r/discordapp/comments/8t04ag/this_image_shows_different_text_depending_on/'
				},
				{
					name: 'u/AelinSA',
					url: 'https://www.reddit.com/user/AelinSA',
					reason: 'Image',
					reasonURL: 'https://www.reddit.com/r/discordapp/comments/9krnhr/preach_the_message_of_the_möth_with_this_magi'
				},
				{
					name: 'JoJo\'s Bizzare Adventure',
					url: 'http://www.araki-jojo.com/',
					reason: 'Original Anime'
				}
			],
			args: [
				{
					key: 'type',
					prompt: `What type of meme do you want to use? Either ${list(types, 'or')}.`,
					type: 'string',
					default: 'default',
					oneOf: types,
					parse: type => type.toLowerCase()
				}
			]
		});
	}

	run(msg, { type }) {
		return msg.say({
			files: [path.join(__dirname, '..', '..', 'assets', 'images', 'dark-light', `${type}.png`)]
		});
	}
};
