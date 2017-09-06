const Command = require('../../structures/Command');
const { list } = require('../../structures/Util');
const tags = require('../../assets/json/tag');

module.exports = class TagCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tag',
			aliases: ['easter-egg', 'mini-command'],
			group: 'random',
			memberName: 'tag',
			description: 'Little mini responses that didn\'t quite make the command cut.',
			args: [
				{
					key: 'tag',
					prompt: `What tag do you want to view? Either ${list(Object.keys(tags), 'or')}.`,
					type: 'string',
					validate: tag => {
						if (tags[tag.toLowerCase()]) return true;
						return `Invalid tag, please enter either ${list(Object.keys(tags), 'or')}.`;
					},
					parse: tag => tag.toLowerCase()
				}
			]
		});
	}

	run(msg, args) {
		const { tag } = args;
		return msg.say(tags[tag]);
	}
};
