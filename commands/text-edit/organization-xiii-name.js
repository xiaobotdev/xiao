const Command = require('../../structures/Command');
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

	run(msg, args) {
		const { text } = args;
		text.push('x');
		const converted = shuffle(text).join('');
		return msg.say(`\u180E${converted}`);
	}
};
