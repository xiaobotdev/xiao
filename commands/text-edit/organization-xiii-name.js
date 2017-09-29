const { Command } = require('discord.js-commando');
const { shuffle } = require('../../structures/Util');

module.exports = class OrganizationXIIINameCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'organization-xiii-name',
			aliases: ['org-xiii-name', 'xiii-name', 'nobody-name'],
			group: 'text-edit',
			memberName: 'organization-xiii-name',
			description: 'Converts a name into the Organization XIII style.',
			args: [
				{
					key: 'text',
					prompt: 'What name would you like to convert?',
					type: 'string',
					parse: text => text.toLowerCase().split('')
				}
			]
		});
	}

	run(msg, { text }) {
		text.push('x');
		const shuffled = shuffle(text);
		shuffled[0] = shuffled[0].toUpperCase();
		return msg.say(shuffled.join(''));
	}
};
