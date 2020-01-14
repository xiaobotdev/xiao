const Command = require('../../structures/Command');
const { shuffle, firstUpperCase } = require('../../util/Util');

module.exports = class NobodyNameCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'nobody-name',
			aliases: ['organization-name', 'org-name', 'organization-xiii-name'],
			group: 'text-edit',
			memberName: 'nobody-name',
			description: 'Converts a name into the Organization XIII style.',
			credit: [
				{
					name: 'Square Enix',
					url: 'https://square-enix-games.com/',
					reason: 'Original "Kingdom Hearts" Game',
					reasonURL: 'https://www.kingdomhearts.com/home/us/'
				}
			],
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
