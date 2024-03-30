const Command = require('../../framework/Command');
const { shuffle, firstUpperCase } = require('../../util/Util');
const forced = require('../../assets/json/nobody-name');

module.exports = class NobodyNameCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'nobody-name',
			aliases: [
				'organization-name',
				'org-name',
				'organization-xiii-name',
				'organization-13-name',
				'org-13-name',
				'org-xiii-name'
			],
			group: 'edit-text',
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
					type: 'string',
					max: 1950,
					parse: text => text.toLowerCase()
				}
			]
		});
	}

	run(msg, { text }) {
		if (forced[text.toLowerCase()]) return msg.say(forced[text.toLowerCase()]);
		const letters = text.split('');
		letters.push('x');
		const shuffled = shuffle(letters);
		return msg.say(firstUpperCase(shuffled.join('')));
	}
};
