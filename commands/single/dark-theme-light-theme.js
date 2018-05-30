const Command = require('../../structures/Command');

module.exports = class DarkThemeLightThemeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dark-theme-light-theme',
			aliases: ['light-theme-dark-theme', 'dark-theme', 'light-theme'],
			group: 'single',
			memberName: 'dark-theme-light-theme',
			description: 'Determines whether you use dark or light theme.',
			clientPermissions: ['ATTACH_FILES']
		});
	}

	run(msg) {
		return msg.say({ files: ['https://i.imgur.com/k0G7sZL.png'] });
	}
};
