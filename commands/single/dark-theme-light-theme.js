const Command = require('../../structures/Command');
const path = require('path');
const { list } = require('../../util/Util');
const types = ['default', 'moth'];

module.exports = class DarkThemeLightThemeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dark-theme-light-theme',
			aliases: ['light-theme-dark-theme', 'dark-theme', 'light-theme', 'dark-light', 'dtlt'],
			group: 'single',
			memberName: 'dark-theme-light-theme',
			description: 'Determines whether you use dark or light theme.',
			details: `**Types:** ${types.join(', ')}`,
			clientPermissions: ['ATTACH_FILES'],
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
			files: [path.join(__dirname, '..', '..', 'assets', 'images', 'dark-theme-light-theme', `${type}.png`)]
		});
	}
};
