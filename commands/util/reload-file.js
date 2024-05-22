const Command = require('../../framework/Command');

module.exports = class ReloadFileCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reload-file',
			group: 'util',
			description: 'Reloads a file.',
			details: 'Only the bot owner(s) may use this command.',
			guarded: true,
			ownerOnly: true,
			args: [
				{
					key: 'file',
					type: 'string',
					validate: file => {
						try {
							require.resolve(`../../${file}`);
							return true;
						} catch {
							return false;
						}
					}
				}
			]
		});
	}

	run(msg, { file }) {
		delete require.cache[require.resolve(`../../${file}`)];
		require(`../../${file}`);
		return msg.say(`Reloaded \`${file}\`.`);
	}
};
