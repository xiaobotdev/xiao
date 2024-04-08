const SlashCommand = require('../framework/slash/SlashCommand');

module.exports = class LennyCommand extends SlashCommand {
	constructor(client) {
		super(client, {
			name: 'lenny',
			description: 'Responds with a lenny face.'
		});
	}

	run(interaction) {
		return interaction.reply('( ͡° ͜ʖ ͡°)');
	}
};
