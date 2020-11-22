const Command = require('../../structures/Command');

module.exports = class IbHardcoreEditionCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ib-hardcore-editon',
			aliases: ['ib-hardcore', 'ib'],
			group: 'games-sp',
			memberName: 'ib-hardcore-edition',
			description: 'Responds with the download link for Ib: Hardcore Edition.'
		});
	}

	run(msg) {
		return msg.say('https://drive.google.com/file/d/1RHDvI8RthElngagvwu-GXUN69-oHsUBO/view?usp=sharing');
	}
};
