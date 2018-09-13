const Command = require('../../structures/Command');
const { shuffle, firstUpperCase } = require('../../util/Util');

module.exports = class OrganizationXIIINameCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'organization-xiii-name',
			aliases: [
				'organization-xiii',
				'xiii-name',
				'xiii',
				'13-name',
				'org-xiii-name',
				'org-xiii',
				'organization-13-name',
				'organization-13',
				'org-13-name',
				'org-13',
				'organization-name',
				'org-name',
				'org',
				'nobody-name'
			],
			group: 'text-edit',
			memberName: 'organization-xiii-name',
			description: 'Converts a name into the Organization XIII style.',
			args: [
				{
					key: 'text',
					prompt: 'What name would you like to convert?',
					type: 'string',
					max: 1950,
					parse: text => text.toLowerCase()
				}
			]
		});
	}

	run(msg, { text }) {
		const letters = text.split('');
		letters.push('x');
		const shuffled = shuffle(letters);
		return msg.say(firstUpperCase(shuffled.join('')));
	}
};
