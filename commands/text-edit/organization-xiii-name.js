const Command = require('../../structures/Command');
const { shuffle } = require('../../util/Util');

module.exports = class OrganizationXIIINameCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'organization-xiii-name',
			aliases: ['xiii-name', 'nobody-name', 'organization-xiii', 'org-xiii', 'xiii', 'organization-13-name', 'org-13'],
			group: 'text-edit',
			memberName: 'organization-xiii-name',
			description: 'Converts a name into the Organization XIII style.',
			args: [
				{
					key: 'text',
					prompt: 'What name would you like to convert?',
					type: 'string',
					max: 1950,
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
