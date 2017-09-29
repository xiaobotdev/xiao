const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { list } = require('../../structures/Util');
const genders = ['male', 'female', 'both'];

module.exports = class NameCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'name',
			aliases: ['random-person'],
			group: 'random-res',
			memberName: 'name',
			description: 'Responds with a random name, with the gender of your choice.',
			args: [
				{
					key: 'gender',
					prompt: `Which gender do you want to generate a name for? Either ${list(genders, 'or')}.`,
					type: 'string',
					default: 'both',
					validate: gender => {
						if (genders.includes(gender.toLowerCase())) return true;
						return `Invalid gender, please enter either ${list(genders, 'or')}.`;
					},
					parse: gender => gender.toLowerCase()
				}
			]
		});
	}

	async run(msg, { gender }) {
		try {
			const { body } = await snekfetch
				.get('http://namey.muffinlabs.com/name.json')
				.query({
					with_surname: true,
					type: gender,
					frequency: 'all'
				});
			return msg.say(body[0]);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
